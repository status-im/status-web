/**
 * AnvilRpcHelper — JSON-RPC helper for Anvil fork state management.
 *
 * Provides:
 * - Snapshot/revert for test isolation
 * - ETH balance manipulation
 * - SNT minting via MiniMeToken controller impersonation
 * - LINEA token funding via storage slot manipulation
 *
 * All operations use raw fetch() — no external dependencies needed.
 */

// Well-known contract addresses
export const CONTRACTS = {
  // Mainnet tokens
  SNT: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
  // Linea token
  LINEA: '0x1789e0043623282D5DCc7F213d703C6D8BAfBB04',
  // Vault contracts (mainnet unless noted)
  WETH_VAULT: '0xc71Ec84Ee70a54000dB3370807bfAF4309a67a1f',
  SNT_VAULT: '0x493957E168aCCdDdf849913C3d60988c652935Cd',
  GUSD_VAULT: '0x79B4cDb14A31E8B0e21C0120C409Ac14Af35f919',
  LINEA_VAULT: '0xb223cA53A53A5931426b601Fa01ED2425D8540fB', // Linea chain
} as const

// OpenZeppelin v5 ERC20Upgradeable namespaced storage slot for _balances.
// keccak256(abi.encode(uint256(keccak256("openzeppelin.storage.ERC20")) - 1)) & ~bytes32(uint256(0xff))
const OZ_V5_ERC20_BALANCE_SLOT =
  0x52c63247e1f47db19d5ce0460030c497f067ca4cebf71ba98eeadabe20bace00n

// SNT (MiniMeToken) controller — can mint via generateTokens()
const SNT_CONTROLLER = '0x52aE2B53C847327f95A5084a7C38c0adb12fD302'

// Function selectors (4 bytes)
const SELECTORS = {
  // ERC20.balanceOf(address)
  BALANCE_OF: '0x70a08231',
  // ERC20.approve(address,uint256)
  APPROVE: '0x095ea7b3',
  // MiniMeToken.generateTokens(address,uint256)
  GENERATE_TOKENS: '0x827f32c0',
  // ERC20.totalSupply()
  TOTAL_SUPPLY: '0x18160ddd',
  // ERC4626.totalAssets()
  TOTAL_ASSETS: '0x01e1d114',
} as const

/** Encode an address as 32-byte ABI parameter (left-padded with zeros) */
function encodeAddress(address: string): string {
  return address.slice(2).toLowerCase().padStart(64, '0')
}

/** Encode a uint256 as 32-byte ABI parameter */
function encodeUint256(value: bigint): string {
  return value.toString(16).padStart(64, '0')
}

/** Convert bigint to hex string with 0x prefix */
function toHex(value: bigint): string {
  return '0x' + value.toString(16)
}

/** Transient RPC failure (network, 5xx, 429) — safe to retry */
export class TransientRpcError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TransientRpcError'
  }
}

/** Deterministic RPC failure (invalid params, reverts) — do NOT retry */
export class RpcError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'RpcError'
  }
}

export interface FundingPreset {
  /** ETH amount on mainnet fork (for gas). Linea ETH comes from base snapshot. */
  eth?: bigint
  snt?: bigint
  linea?: bigint
  weth?: bigint
  usdt?: bigint
  usdc?: bigint
  usds?: bigint
}

// Module-level slot cache — survives across AnvilRpcHelper instances.
// Safe with workers: 1. Eliminates 240 RPC calls on fallback revert paths.
const globalSlotCache = new Map<string, bigint>()
let globalLineaSlot: bigint | null = null

// Vault accounting slots (totalSupply / stored totalAssets) per token:rpc:getter.
// `null` = getter has no single backing slot (fully derived) — nothing to bump.
const globalVaultAccountingSlotCache = new Map<string, bigint | null>()

export class AnvilRpcHelper {
  private rpcIdCounter = 0
  private lineaTokenBalanceSlot: bigint | null = globalLineaSlot
  private erc20BalanceSlotCache = globalSlotCache

  constructor(
    readonly mainnetRpc: string,
    readonly lineaRpc: string,
    readonly walletAddress: string,
  ) {}

  // ---------------------------------------------------------------------------
  // Snapshot / Revert
  // ---------------------------------------------------------------------------

  /** Take a snapshot of the current state. Returns snapshot ID. */
  async snapshot(rpc?: string): Promise<string> {
    return this.call(rpc ?? this.mainnetRpc, 'evm_snapshot', [])
  }

  /**
   * Revert to a snapshot. The snapshot is consumed (one-time use).
   * Returns true if successful.
   */
  async revert(snapshotId: string, rpc?: string): Promise<boolean> {
    return this.call(rpc ?? this.mainnetRpc, 'evm_revert', [snapshotId])
  }

  /**
   * Take snapshots on both forks. Returns { mainnet, linea } snapshot IDs.
   */
  async snapshotBoth(): Promise<{ mainnet: string; linea: string }> {
    const [mainnet, linea] = await Promise.all([
      this.snapshot(this.mainnetRpc),
      this.snapshot(this.lineaRpc),
    ])
    return { mainnet, linea }
  }

  /**
   * Revert both forks to their snapshots.
   */
  async revertBoth(ids: { mainnet: string; linea: string }): Promise<void> {
    await Promise.all([
      this.revert(ids.mainnet, this.mainnetRpc),
      this.revert(ids.linea, this.lineaRpc),
    ])
  }

  // ---------------------------------------------------------------------------
  // Block mining
  // ---------------------------------------------------------------------------

  /**
   * Enable interval mining on Anvil — mine a block every `intervalSec` seconds.
   * IMPORTANT: evm_setIntervalMining DISABLES auto-mining. Call enableAutoMining()
   * after this to re-enable instant tx confirmation alongside periodic empty blocks.
   */
  async enableIntervalMining(intervalSec: number, rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_setIntervalMining', [
      intervalSec,
    ])
  }

  /**
   * Wait until eth_chainId returns the expected value.
   * Useful after network switches to confirm Anvil fork is responsive.
   */
  async waitForChain(
    expectedChainId: number,
    rpc?: string,
    timeoutMs = 15_000,
  ): Promise<void> {
    const target = rpc ?? this.mainnetRpc
    const hex = '0x' + expectedChainId.toString(16)
    const deadline = Date.now() + timeoutMs
    while (Date.now() < deadline) {
      const result = await this.call(target, 'eth_chainId', []).catch(
        () => null,
      )
      if (result === hex) return
      await new Promise(r => setTimeout(r, 500))
    }
    throw new Error(
      `Chain ${expectedChainId} not ready on ${target} within ${timeoutMs}ms`,
    )
  }

  /** Enable auto-mining — transactions are mined immediately when received. */
  async enableAutoMining(rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_setAutomine', [true])
  }

  /** Mine a single block on Anvil */
  async mineBlock(rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_mine', [])
  }

  /**
   * Disable auto-mining — submitted txs stay pending until a block is mined
   * explicitly (mineBlock) or by interval mining. Used by congestion profiles
   * (high-base-fee / stuck-tx) to hold transactions in the mempool.
   */
  async disableAutoMining(rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_setAutomine', [false])
  }

  // ---------------------------------------------------------------------------
  // Congestion controls
  // ---------------------------------------------------------------------------

  /**
   * Set the base fee for the NEXT block via anvil_setNextBlockBaseFeePerGas.
   * The wallet's fee estimator reads eth_feeHistory / eth_maxPriorityFeePerGas
   * from the fork, so raising this makes the wallet quote higher gas and lets us
   * exercise the send flow's "gas shifted" handling. Mine a block for it to take
   * effect on subsequent estimates.
   */
  async setNextBlockBaseFee(weiPerGas: bigint, rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'anvil_setNextBlockBaseFeePerGas', [
      toHex(weiPerGas),
    ])
  }

  /**
   * Set the block gas limit via evm_setBlockGasLimit. Lowering it below a tx's
   * gas requirement forces that tx to fail, exercising the "tight gas limit"
   * congestion profile.
   */
  async setBlockGasLimit(gasLimit: bigint, rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_setBlockGasLimit', [
      toHex(gasLimit),
    ])
  }

  /**
   * Drop a pending transaction from the mempool via anvil_dropTransaction.
   * Useful to clean up a deliberately-stuck tx between tests.
   */
  async dropTransaction(txHash: string, rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'anvil_dropTransaction', [txHash])
  }

  // ---------------------------------------------------------------------------
  // Vault state
  // ---------------------------------------------------------------------------

  /** Vault state storage slot (slot 8 = vault enabled flag) */
  private static readonly VAULT_STATE_SLOT =
    '0x0000000000000000000000000000000000000000000000000000000000000008'
  private static readonly VAULT_ENABLED_VALUE =
    '0x0000000000000000000000000000000000000000000000000000000000000001'

  /** Enable a vault by setting its state storage slot to "enabled" */
  async enableVault(vaultAddress: string, rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'anvil_setStorageAt', [
      vaultAddress,
      AnvilRpcHelper.VAULT_STATE_SLOT,
      AnvilRpcHelper.VAULT_ENABLED_VALUE,
    ])
  }

  /** Enable all test vaults on their respective forks */
  async enableAllVaults(): Promise<void> {
    await Promise.all([
      this.enableVault(CONTRACTS.WETH_VAULT),
      this.enableVault(CONTRACTS.SNT_VAULT),
      this.enableVault(CONTRACTS.GUSD_VAULT),
      this.enableVault(CONTRACTS.LINEA_VAULT, this.lineaRpc),
    ])
  }

  // ---------------------------------------------------------------------------
  // ETH balance
  // ---------------------------------------------------------------------------

  /** Set ETH balance directly via anvil_setBalance */
  async setEthBalance(amount: bigint, rpc?: string): Promise<void> {
    await this.setEthBalanceFor(this.walletAddress, amount, rpc)
  }

  /**
   * Set an arbitrary account's ETH balance via anvil_setBalance. Also makes the
   * account "locally known" so subsequent state reads (balance, and gas
   * estimation that credits it) don't hit the non-archive fork upstream — use
   * this to pre-register a send recipient before estimating gas / sending.
   */
  async setEthBalanceFor(
    address: string,
    amount: bigint,
    rpc?: string,
  ): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'anvil_setBalance', [
      address,
      toHex(amount),
    ])
  }

  /**
   * Read the wallet's native ETH balance. Reads a locally-set account (via
   * setEthBalance), so it does not hit the non-archive fork upstream — use this
   * to assert a send's effect via the sender's delta rather than the recipient's
   * (an un-modified recipient triggers an archive request).
   */
  async getEthBalance(address?: string, rpc?: string): Promise<bigint> {
    const result = await this.call<string>(
      rpc ?? this.mainnetRpc,
      'eth_getBalance',
      [address ?? this.walletAddress, 'latest'],
    )
    return BigInt(result)
  }

  // ---------------------------------------------------------------------------
  // ERC-20 token funding
  // ---------------------------------------------------------------------------

  /**
   * Fund SNT tokens (18 decimals) via MiniMeToken.generateTokens().
   * SNT uses MiniMeToken which supports minting by the controller.
   * Whale transfer won't work (Binance no longer holds SNT).
   */
  async fundSnt(amount: bigint): Promise<void> {
    // Retry: the controller's account state can fall outside the upstream fork
    // provider's retention window (-32014 / ErrUpstreamsExhausted). Retries
    // often succeed once eRPC re-caches or the upstream re-serves the block.
    await this.callWithRetry(this.mainnetRpc, 'anvil_setBalance', [
      SNT_CONTROLLER,
      toHex(10n ** 18n),
    ])

    const data =
      SELECTORS.GENERATE_TOKENS +
      encodeAddress(this.walletAddress) +
      encodeUint256(amount)

    await this.callWithRetry(this.mainnetRpc, 'anvil_impersonateAccount', [
      SNT_CONTROLLER,
    ])
    await this.callWithRetry(this.mainnetRpc, 'eth_sendTransaction', [
      {
        from: SNT_CONTROLLER,
        to: CONTRACTS.SNT,
        data,
      },
    ])
    // Force-mine the block: interval mining disables auto-mine, so the tx
    // sits in the mempool until the next 1-second tick. Mine explicitly to
    // avoid a race between tx inclusion and the balance check below.
    await this.mineBlock()
    await this.call(this.mainnetRpc, 'anvil_stopImpersonatingAccount', [
      SNT_CONTROLLER,
    ])

    // Verify minting succeeded (tx could still revert on-chain)
    const balance = await this.getErc20Balance(CONTRACTS.SNT, this.mainnetRpc)
    if (balance < amount) {
      throw new Error(
        `SNT funding failed: expected >= ${amount}, got ${balance}. ` +
          'The MiniMeToken controller may have changed.',
      )
    }
  }

  // ---------------------------------------------------------------------------
  // ERC-20 storage-based funding (for tokens without a known whale)
  // ---------------------------------------------------------------------------

  /** Compute keccak256 via Anvil RPC (web3_sha3) — no external dependencies */
  private async keccak256(hexData: string, rpc: string): Promise<string> {
    return this.call(rpc, 'web3_sha3', [hexData])
  }

  /** Read ERC-20 balanceOf via eth_call (retries transient failures) */
  async getErc20Balance(
    token: string,
    rpc?: string,
    owner: string = this.walletAddress,
  ): Promise<bigint> {
    const data = SELECTORS.BALANCE_OF + encodeAddress(owner)
    const result = await this.callWithRetry<string>(
      rpc ?? this.mainnetRpc,
      'eth_call',
      [{ to: token, data }, 'latest'],
    )
    return BigInt(result)
  }

  /** Poll until a transaction receipt is available (and not reverted). */
  async waitForTransactionReceipt(
    hash: string,
    rpc?: string,
    timeoutMs = 30_000,
  ): Promise<void> {
    const targetRpc = rpc ?? this.mainnetRpc
    const deadline = Date.now() + timeoutMs

    while (Date.now() < deadline) {
      const receipt = await this.call<{
        status?: string
      } | null>(targetRpc, 'eth_getTransactionReceipt', [hash])

      if (receipt?.status) {
        if (receipt.status === '0x0') {
          throw new Error(`Transaction reverted: ${hash}`)
        }
        return
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    throw new Error(`Timed out waiting for transaction receipt: ${hash}`)
  }

  /** Current pending nonce for an account (`eth_getTransactionCount`, latest). */
  async getTransactionCount(account: string, rpc?: string): Promise<bigint> {
    const result = await this.callWithRetry<string>(
      rpc ?? this.mainnetRpc,
      'eth_getTransactionCount',
      [account, 'latest'],
    )
    return BigInt(result)
  }

  /**
   * Wait for the next transaction from `account` after MetaMask approval.
   * Pass `startNonce` captured before submitting the form so a fast-mined tx
   * is not missed.
   */
  async waitForAccountTransaction(
    account: string,
    rpc?: string,
    startNonce?: bigint,
    timeoutMs = 90_000,
  ): Promise<string> {
    const targetRpc = rpc ?? this.mainnetRpc
    const baselineNonce =
      startNonce ?? (await this.getTransactionCount(account, targetRpc))
    const deadline = Date.now() + timeoutMs

    while (Date.now() < deadline) {
      const currentNonce = await this.getTransactionCount(account, targetRpc)

      if (currentNonce > baselineNonce) {
        const txHash = await this.findTransactionByNonce(
          account,
          baselineNonce,
          targetRpc,
        )
        if (txHash) {
          await this.waitForTransactionReceipt(txHash, targetRpc, 30_000)
          return txHash
        }
      }

      await new Promise(resolve => setTimeout(resolve, 500))
    }

    throw new Error(
      `Timed out waiting for transaction from ${account} on ${targetRpc}`,
    )
  }

  /**
   * Poll until a vault share balance reaches zero, mining blocks along the way.
   * Prefer this over receipt polling for Linea — MetaMask can leave txs pending
   * until the fork mines, and receipt helpers may race the UI broadcast.
   */
  async waitForSharesBurned(
    vault: string,
    owner: string,
    rpc?: string,
    timeoutMs = 120_000,
  ): Promise<void> {
    const targetRpc = rpc ?? this.mainnetRpc
    const deadline = Date.now() + timeoutMs

    while (Date.now() < deadline) {
      await this.mineBlock(targetRpc)
      const balance = await this.getErc20Balance(vault, targetRpc, owner)
      if (balance === 0n) {
        return
      }
      await new Promise(resolve => setTimeout(resolve, 500))
    }

    throw new Error(
      `Timed out waiting for ${vault} shares to burn for ${owner}`,
    )
  }

  private async findTransactionByNonce(
    account: string,
    nonce: bigint,
    rpc: string,
  ): Promise<string | null> {
    const latestHex = await this.call<string>(rpc, 'eth_blockNumber', [])
    const latest = Number.parseInt(latestHex, 16)
    const normalizedAccount = account.toLowerCase()

    for (
      let blockNumber = latest;
      blockNumber >= 0 && blockNumber >= latest - 10;
      blockNumber--
    ) {
      const block = await this.call<{
        transactions?: Array<{ from?: string; nonce?: string; hash?: string }>
      }>(rpc, 'eth_getBlockByNumber', [`0x${blockNumber.toString(16)}`, true])

      for (const tx of block.transactions ?? []) {
        if (
          tx.from?.toLowerCase() === normalizedAccount &&
          tx.nonce !== undefined &&
          BigInt(tx.nonce) === nonce &&
          tx.hash
        ) {
          return tx.hash
        }
      }
    }

    return null
  }

  /**
   * Set ERC-20 balance by writing directly to the _balances mapping storage slot.
   * @param token - ERC-20 contract address
   * @param amount - balance in smallest unit
   * @param balanceSlot - storage slot of the _balances mapping (bigint for OZ v5 namespaced slots)
   * @param rpc - RPC endpoint
   * @param owner - account whose balance to set (defaults to the test wallet)
   */
  private async setErc20BalanceViaStorage(
    token: string,
    amount: bigint,
    balanceSlot: bigint,
    rpc: string,
    owner: string = this.walletAddress,
  ): Promise<void> {
    // Storage key for mapping(address => uint256) at slot S:
    // keccak256(abi.encode(address, S))
    const key = '0x' + encodeAddress(owner) + encodeUint256(balanceSlot)
    const storagePosition = await this.keccak256(key, rpc)

    await this.call(rpc, 'anvil_setStorageAt', [
      token,
      storagePosition,
      '0x' + encodeUint256(amount),
    ])
  }

  /**
   * Find the storage slot of the _balances mapping by brute-force.
   * Sets a unique test value at candidate slots and checks via balanceOf().
   * Non-destructive: uses snapshot/revert.
   */
  private async findErc20BalanceSlot(
    token: string,
    rpc: string,
  ): Promise<bigint> {
    const testAmount = 133742069n * 10n ** 18n
    const candidateSlots: bigint[] = [
      0n,
      1n,
      2n,
      3n,
      4n,
      5n, // Standard ERC-20 layouts
      6n,
      7n,
      8n,
      9n,
      10n, // Proxy / custom layouts (USDC FiatTokenV2 = slot 9)
      OZ_V5_ERC20_BALANCE_SLOT, // OpenZeppelin v5 ERC20Upgradeable
    ]

    const snapshotId = await this.snapshot(rpc)

    try {
      for (const slot of candidateSlots) {
        await this.setErc20BalanceViaStorage(token, testAmount, slot, rpc)
        const balance = await this.getErc20Balance(token, rpc)

        if (balance === testAmount) {
          return slot
        }
      }

      throw new Error(
        `Could not find _balances storage slot for token ${token}. ` +
          `Tried slots: ${candidateSlots.map(s => '0x' + s.toString(16)).join(', ')}`,
      )
    } finally {
      await this.revert(snapshotId, rpc)
    }
  }

  /**
   * Fund LINEA tokens (18 decimals) on Linea fork via storage manipulation.
   * Auto-discovers the _balances slot on first call and caches it.
   */
  async fundLinea(amount: bigint): Promise<void> {
    if (this.lineaTokenBalanceSlot === null) {
      this.lineaTokenBalanceSlot = await this.findErc20BalanceSlot(
        CONTRACTS.LINEA,
        this.lineaRpc,
      )
      globalLineaSlot = this.lineaTokenBalanceSlot
    }

    await this.setErc20BalanceViaStorage(
      CONTRACTS.LINEA,
      amount,
      this.lineaTokenBalanceSlot,
      this.lineaRpc,
    )
  }

  /**
   * Generic ERC-20 funding via storage slot manipulation.
   * Auto-discovers the _balances slot on first call per token and caches it.
   * The _balances slot is the same for every account, so slot discovery always
   * probes the test wallet; only the final write targets `owner`.
   */
  async fundErc20ViaStorage(
    token: string,
    amount: bigint,
    rpc: string,
    owner: string = this.walletAddress,
  ): Promise<void> {
    const cacheKey = `${token}:${rpc}`
    if (!this.erc20BalanceSlotCache.has(cacheKey)) {
      const slot = await this.findErc20BalanceSlot(token, rpc)
      this.erc20BalanceSlotCache.set(cacheKey, slot)
    }
    await this.setErc20BalanceViaStorage(
      token,
      amount,
      this.erc20BalanceSlotCache.get(cacheKey)!,
      rpc,
      owner,
    )
  }

  /** Fund WETH via storage (simpler and faster than actual wrapping on Anvil) */
  async fundWeth(amount: bigint): Promise<void> {
    await this.fundErc20ViaStorage(CONTRACTS.WETH, amount, this.mainnetRpc)
  }

  /** Fund USDT (6 decimals) via storage */
  async fundUsdt(amount: bigint): Promise<void> {
    await this.fundErc20ViaStorage(CONTRACTS.USDT, amount, this.mainnetRpc)
  }

  /** Fund USDC (6 decimals) via storage */
  async fundUsdc(amount: bigint): Promise<void> {
    await this.fundErc20ViaStorage(CONTRACTS.USDC, amount, this.mainnetRpc)
  }

  /** Fund USDS (18 decimals) via storage */
  async fundUsds(amount: bigint): Promise<void> {
    await this.fundErc20ViaStorage(CONTRACTS.USDS, amount, this.mainnetRpc)
  }

  /**
   * Fund a user's ERC-4626 vault shares directly via storage.
   *
   * Pre-deposit vaults are ERC-4626, so the vault contract is itself the share
   * token and `balanceOf(vault, user)` returns shares. Writing the share
   * balance makes the Hub show a deposited balance and enable the withdrawal
   * ("Unlock"/"Claim") CTA.
   *
   * The vault's totalSupply and stored totalAssets are bumped by the same
   * amount to keep its accounting consistent: `withdraw` burns the shares from
   * totalSupply and refuses amounts beyond totalAssets (InvalidState), and the
   * live vaults have drained below 1 token of supply as real depositors exit —
   * seeding a bare balance would make the on-chain `withdraw` revert.
   *
   * @param vaultAddress - the pre-deposit vault (share token) address
   * @param shares - share balance to assign, in wei
   * @param rpc - target fork RPC (defaults to mainnet)
   * @param owner - account to credit; pass the connected dApp account so the
   *   Hub reads the seeded balance (defaults to the test wallet)
   */
  async fundVaultShares(
    vaultAddress: string,
    shares: bigint,
    rpc?: string,
    owner?: string,
  ): Promise<void> {
    const targetRpc = rpc ?? this.mainnetRpc
    const previousShares = await this.getErc20Balance(
      vaultAddress,
      targetRpc,
      owner ?? this.walletAddress,
    )

    await this.fundErc20ViaStorage(vaultAddress, shares, targetRpc, owner)

    const delta = shares - previousShares
    if (delta > 0n) {
      await this.bumpVaultAccounting(vaultAddress, delta, targetRpc)
    }
  }

  /**
   * Add `delta` to the vault's totalSupply and stored totalAssets so shares
   * seeded via storage remain burnable/withdrawable on-chain. totalAssets may
   * be fully derived (no backing slot) on some vaults — then there is nothing
   * to bump and it is skipped; totalSupply must always resolve for an ERC-20.
   */
  private async bumpVaultAccounting(
    vaultAddress: string,
    delta: bigint,
    rpc: string,
  ): Promise<void> {
    const getters = [
      { name: 'totalSupply', selector: SELECTORS.TOTAL_SUPPLY, required: true },
      {
        name: 'totalAssets',
        selector: SELECTORS.TOTAL_ASSETS,
        required: false,
      },
    ] as const

    for (const getter of getters) {
      const cacheKey = `${vaultAddress}:${rpc}:${getter.selector}`
      if (!globalVaultAccountingSlotCache.has(cacheKey)) {
        globalVaultAccountingSlotCache.set(
          cacheKey,
          await this.findUintGetterSlot(vaultAddress, getter.selector, rpc),
        )
      }

      const slot = globalVaultAccountingSlotCache.get(cacheKey)!
      if (slot === null) {
        if (getter.required) {
          throw new Error(
            `Could not find the ${getter.name} storage slot for vault ${vaultAddress}`,
          )
        }
        continue
      }

      const slotHex = '0x' + encodeUint256(slot)
      const raw = await this.call<string>(rpc, 'eth_getStorageAt', [
        vaultAddress,
        slotHex,
        'latest',
      ])
      await this.call(rpc, 'anvil_setStorageAt', [
        vaultAddress,
        slotHex,
        '0x' + encodeUint256(BigInt(raw) + delta),
      ])
    }
  }

  /**
   * Find the storage slot backing a parameterless uint256 getter (totalSupply /
   * totalAssets) by value-matching raw slots 0..12 and confirming each match
   * with a write probe. The probe matters: the pre-deposit vaults keep
   * totalSupply and stored totalAssets equal, so a value match alone is
   * ambiguous. Returns null when no slot backs the getter (derived value).
   * Non-destructive: uses snapshot/revert.
   */
  private async findUintGetterSlot(
    token: string,
    getterSelector: string,
    rpc: string,
  ): Promise<bigint | null> {
    const readGetter = async (): Promise<bigint> => {
      const result = await this.callWithRetry<string>(rpc, 'eth_call', [
        { to: token, data: getterSelector },
        'latest',
      ])
      return BigInt(result)
    }

    const currentValue = await readGetter()
    const probeValue = currentValue + 1n
    const snapshotId = await this.snapshot(rpc)

    try {
      for (let slot = 0n; slot <= 12n; slot++) {
        const slotHex = '0x' + encodeUint256(slot)
        const raw = await this.call<string>(rpc, 'eth_getStorageAt', [
          token,
          slotHex,
          'latest',
        ])
        if (BigInt(raw) !== currentValue) continue

        await this.call(rpc, 'anvil_setStorageAt', [
          token,
          slotHex,
          '0x' + encodeUint256(probeValue),
        ])
        if ((await readGetter()) === probeValue) {
          return slot
        }
        // Equal-valued sibling slot (e.g. totalSupply vs totalAssets) — restore
        // and keep probing.
        await this.call(rpc, 'anvil_setStorageAt', [token, slotHex, raw])
      }
      return null
    } finally {
      await this.revert(snapshotId, rpc)
    }
  }

  /**
   * Ensure vault shares exist for on-chain `withdraw` execute tests.
   *
   * Keeps inherited fork balances when present. Seeds via storage only when
   * `balanceOf` is zero — CI forks may not have production deposits for the
   * test wallet. WETH uses a smaller seed (~1.1e16): a full 1e18 storage seed
   * makes `balanceOf` non-zero but `withdraw` still reverts on the fork.
   */
  async ensureVaultSharesForExecute(
    vaultAddress: string,
    rpc: string,
    owner: string,
  ): Promise<bigint> {
    const existing = await this.getErc20Balance(vaultAddress, rpc, owner)
    if (existing > 0n) {
      return existing
    }

    const isWethVault =
      vaultAddress.toLowerCase() === CONTRACTS.WETH_VAULT.toLowerCase()
    const shares = isWethVault ? 11n * 10n ** 15n : 10n ** 18n

    await this.fundVaultShares(vaultAddress, shares, rpc, owner)

    const funded = await this.getErc20Balance(vaultAddress, rpc, owner)
    if (funded === 0n) {
      throw new Error(
        `Failed to seed vault shares for execute test: ${vaultAddress}`,
      )
    }
    return funded
  }

  /**
   * Reset ERC-20 allowance to 0 for a specific spender.
   * Uses impersonation to call approve(spender, 0) from the wallet.
   * Needed when the fork state has pre-existing allowances that cause the Hub
   * to skip the approve step (showing "Deposit" instead of "Approve Deposit").
   */
  async resetAllowance(
    token: string,
    spender: string,
    rpc?: string,
  ): Promise<void> {
    const targetRpc = rpc ?? this.mainnetRpc
    const data = SELECTORS.APPROVE + encodeAddress(spender) + encodeUint256(0n)

    await this.call(targetRpc, 'anvil_impersonateAccount', [this.walletAddress])
    await this.call(targetRpc, 'eth_sendTransaction', [
      {
        from: this.walletAddress,
        to: token,
        data,
      },
    ])
    await this.mineBlock(targetRpc)
    await this.call(targetRpc, 'anvil_stopImpersonatingAccount', [
      this.walletAddress,
    ])
  }

  /**
   * Apply a funding preset: set ETH + fund specific tokens.
   * Designed for test.beforeEach — call after revert to set exact preconditions.
   */
  async fund(preset: FundingPreset): Promise<void> {
    if (preset.eth !== undefined) {
      await this.setEthBalance(preset.eth)
    }
    if (preset.snt !== undefined && preset.snt > 0n) {
      await this.fundSnt(preset.snt)
    }
    if (preset.linea !== undefined && preset.linea > 0n) {
      await this.fundLinea(preset.linea)
    }
    if (preset.weth !== undefined && preset.weth > 0n) {
      await this.fundWeth(preset.weth)
    }
    if (preset.usdt !== undefined && preset.usdt > 0n) {
      await this.fundUsdt(preset.usdt)
    }
    if (preset.usdc !== undefined && preset.usdc > 0n) {
      await this.fundUsdc(preset.usdc)
    }
    if (preset.usds !== undefined && preset.usds > 0n) {
      await this.fundUsds(preset.usds)
    }
  }

  // ---------------------------------------------------------------------------
  // Health check
  // ---------------------------------------------------------------------------

  /** Check if an Anvil RPC endpoint is reachable (retries transient failures) */
  async healthCheck(rpc?: string): Promise<boolean> {
    try {
      await this.callWithRetry(
        rpc ?? this.mainnetRpc,
        'eth_blockNumber',
        [],
        3,
        500,
      )
      return true
    } catch {
      return false
    }
  }

  /** Check if a contract exists at the given address (has deployed bytecode) */
  async contractExists(address: string, rpc?: string): Promise<boolean> {
    const code = await this.callWithRetry(
      rpc ?? this.mainnetRpc,
      'eth_getCode',
      [address, 'latest'],
      3,
      500,
    )
    return code !== '0x' && code !== '0x0'
  }

  /** Check both forks are reachable and key contracts exist. Throws with a clear message if not. */
  async requireHealthy(): Promise<void> {
    const [mainnetOk, lineaOk] = await Promise.all([
      this.healthCheck(this.mainnetRpc),
      this.healthCheck(this.lineaRpc),
    ])

    if (!mainnetOk || !lineaOk) {
      const down = [
        !mainnetOk && `mainnet (${this.mainnetRpc})`,
        !lineaOk && `linea (${this.lineaRpc})`,
      ]
        .filter(Boolean)
        .join(', ')

      throw new Error(
        `Anvil fork(s) not reachable: ${down}. ` +
          'Start them with: cd e2e && pnpm anvil:up',
      )
    }

    // Verify key contracts exist on the fork (catches stale/incomplete forks)
    const keyContracts = [
      { address: CONTRACTS.SNT, name: 'SNT', rpc: this.mainnetRpc },
      { address: CONTRACTS.WETH, name: 'WETH', rpc: this.mainnetRpc },
      { address: CONTRACTS.LINEA, name: 'LINEA', rpc: this.lineaRpc },
    ]

    const results = await Promise.all(
      keyContracts.map(async ({ address, name, rpc }) => ({
        name,
        address,
        exists: await this.contractExists(address, rpc),
      })),
    )
    const missing = results.filter(r => !r.exists)
    if (missing.length > 0) {
      throw new Error(
        `Contracts not found on fork: ${missing.map(m => `${m.name} (${m.address})`).join(', ')}. ` +
          'The fork state may be stale or incomplete.',
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Raw RPC
  // ---------------------------------------------------------------------------

  private async call<T = unknown>(
    rpc: string,
    method: string,
    params: unknown[],
  ): Promise<T> {
    const id = ++this.rpcIdCounter

    let response: Response
    try {
      response = await fetch(rpc, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
      })
    } catch (error) {
      // Network-level failure (DNS, connection refused, timeout) — transient
      throw new TransientRpcError(
        `Anvil RPC network error (${method}): ${error instanceof Error ? error.message : error}`,
      )
    }

    if (!response.ok) {
      const body = await response.text()
      // 5xx and 429 are transient; other HTTP errors are not
      if (response.status >= 500 || response.status === 429) {
        throw new TransientRpcError(
          `Anvil RPC HTTP ${response.status} (${method}): ${body}`,
        )
      }
      throw new RpcError(
        `Anvil RPC HTTP ${response.status} (${method}): ${body}`,
      )
    }

    let json: { result?: T; error?: { message?: string } }
    try {
      json = await response.json()
    } catch {
      throw new TransientRpcError(
        `Anvil RPC invalid JSON response (${method}): status ${response.status}`,
      )
    }

    if (json.error) {
      const message = json.error.message ?? JSON.stringify(json.error)
      // Upstream pruning (pruning-node forks): transient — the upstream's
      // retention window may shift, or eRPC may cache the data next call.
      const code = (json.error as { code?: number }).code
      const isUpstreamMissingData =
        code === -32014 ||
        /historical state .* is not available/i.test(message) ||
        /ErrUpstreamsExhausted|ErrEndpointMissingData/.test(message)
      if (isUpstreamMissingData) {
        throw new TransientRpcError(
          `Anvil RPC upstream-missing-data (${method}): ${message}`,
        )
      }
      // JSON-RPC semantic error — deterministic, do not retry
      throw new RpcError(`Anvil RPC error (${method}): ${message}`)
    }

    return json.result as T
  }

  /**
   * RPC call with retry for transient failures only.
   * Network errors, HTTP 5xx, and 429 are retried.
   * JSON-RPC semantic errors (invalid params, reverts) throw immediately.
   */
  private async callWithRetry<T = unknown>(
    rpc: string,
    method: string,
    params: unknown[],
    maxRetries = 5,
    delayMs = 200,
  ): Promise<T> {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await this.call<T>(rpc, method, params)
      } catch (error) {
        if (!(error instanceof TransientRpcError)) throw error
        if (attempt === maxRetries) throw error
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
    throw new Error(
      `callWithRetry: maxRetries must be >= 1 (got ${maxRetries})`,
    )
  }
}

// ---------------------------------------------------------------------------
// Common funding presets (convenience constants)
// ---------------------------------------------------------------------------

const ETH = 10n ** 18n
const USDT_UNIT = 10n ** 6n
const USDC_UNIT = 10n ** 6n

/** Funding presets for tests */
export const FUNDING_PRESETS = {
  // Below-minimum validation presets
  /** W-4: Below minimum validation. ETH only (no WETH needed — validation fires first). */
  WETH_BELOW_MIN: { eth: 1n * ETH } satisfies FundingPreset,

  /** S-2: SNT below minimum. Need SNT > 0.5 to pass balance check. */
  SNT_BELOW_MIN: { eth: 1n * ETH, snt: 1n * ETH } satisfies FundingPreset,

  /** L-2: LINEA below minimum. Need LINEA > 0.5 to pass balance check. */
  LINEA_BELOW_MIN: { linea: 2n * ETH } satisfies FundingPreset,

  // Happy-path deposit presets
  /** W-1: Wrap ETH then deposit. Only ETH, no WETH. */
  WETH_DEPOSIT_WRAP: { eth: 5n * ETH } satisfies FundingPreset,

  /** W-2: Direct deposit, pre-funded WETH. */
  WETH_DEPOSIT_DIRECT: {
    eth: 1n * ETH,
    weth: 1n * ETH,
  } satisfies FundingPreset,

  /** W-3: Partial wrap. Some WETH + ETH to cover the rest. */
  WETH_DEPOSIT_PARTIAL: {
    eth: 5n * ETH,
    weth: ETH / 100n,
  } satisfies FundingPreset,

  /** S-1: SNT deposit. */
  SNT_DEPOSIT: { eth: 1n * ETH, snt: 100n * ETH } satisfies FundingPreset,

  /** L-1: LINEA deposit. ETH on Linea comes from base snapshot. */
  LINEA_DEPOSIT: { linea: 100n * ETH } satisfies FundingPreset,

  /** G-1: GUSD via USDT. */
  GUSD_USDT_DEPOSIT: {
    eth: 1n * ETH,
    usdt: 100n * USDT_UNIT,
  } satisfies FundingPreset,

  /** G-2: GUSD via USDC. */
  GUSD_USDC_DEPOSIT: {
    eth: 1n * ETH,
    usdc: 100n * USDC_UNIT,
  } satisfies FundingPreset,

  /** G-3: GUSD via USDS. */
  GUSD_USDS_DEPOSIT: {
    eth: 1n * ETH,
    usds: 100n * ETH,
  } satisfies FundingPreset,
} as const
