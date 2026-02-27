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
  // Mainnet
  SNT: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
  // Linea chain
  LINEA: '0x1789e0043623282D5DCc7F213d703C6D8BAfBB04',
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

export interface FundingPreset {
  /** ETH amount on mainnet fork (for gas). Linea ETH comes from setup-anvil.sh base snapshot. */
  eth?: bigint
  snt?: bigint
  linea?: bigint
  weth?: bigint
  usdt?: bigint
  usdc?: bigint
  usds?: bigint
}

export class AnvilRpcHelper {
  private rpcIdCounter = 0
  private lineaTokenBalanceSlot: bigint | null = null
  private erc20BalanceSlotCache = new Map<string, bigint>()

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

  /** Enable auto-mining — transactions are mined immediately when received. */
  async enableAutoMining(rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_setAutomine', [true])
  }

  /** Mine a single block on Anvil */
  async mineBlock(rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'evm_mine', [])
  }

  // ---------------------------------------------------------------------------
  // ETH balance
  // ---------------------------------------------------------------------------

  /** Set ETH balance directly via anvil_setBalance */
  async setEthBalance(amount: bigint, rpc?: string): Promise<void> {
    await this.call(rpc ?? this.mainnetRpc, 'anvil_setBalance', [
      this.walletAddress,
      toHex(amount),
    ])
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
    await this.call(this.mainnetRpc, 'anvil_setBalance', [
      SNT_CONTROLLER,
      toHex(10n ** 18n),
    ])

    const data =
      SELECTORS.GENERATE_TOKENS +
      encodeAddress(this.walletAddress) +
      encodeUint256(amount)

    await this.call(this.mainnetRpc, 'anvil_impersonateAccount', [
      SNT_CONTROLLER,
    ])
    await this.call(this.mainnetRpc, 'eth_sendTransaction', [
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

  /** Read ERC-20 balanceOf via eth_call */
  async getErc20Balance(token: string, rpc?: string): Promise<bigint> {
    const data = SELECTORS.BALANCE_OF + encodeAddress(this.walletAddress)
    const result = await this.call(rpc ?? this.mainnetRpc, 'eth_call', [
      { to: token, data },
      'latest',
    ])
    return BigInt(result)
  }

  /**
   * Set ERC-20 balance by writing directly to the _balances mapping storage slot.
   * @param token - ERC-20 contract address
   * @param amount - balance in smallest unit
   * @param balanceSlot - storage slot of the _balances mapping (bigint for OZ v5 namespaced slots)
   * @param rpc - RPC endpoint
   */
  private async setErc20BalanceViaStorage(
    token: string,
    amount: bigint,
    balanceSlot: bigint,
    rpc: string,
  ): Promise<void> {
    // Storage key for mapping(address => uint256) at slot S:
    // keccak256(abi.encode(address, S))
    const key =
      '0x' + encodeAddress(this.walletAddress) + encodeUint256(balanceSlot)
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
   */
  async fundErc20ViaStorage(
    token: string,
    amount: bigint,
    rpc: string,
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

  /** Check if an Anvil RPC endpoint is reachable */
  async healthCheck(rpc?: string): Promise<boolean> {
    try {
      await this.call(rpc ?? this.mainnetRpc, 'eth_blockNumber', [])
      return true
    } catch {
      return false
    }
  }

  /** Check both forks are reachable. Throws with a clear message if not. */
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
          'Start them with: cd e2e && ./scripts/setup-anvil.sh',
      )
    }
  }

  // ---------------------------------------------------------------------------
  // Raw RPC
  // ---------------------------------------------------------------------------

  private async call(
    rpc: string,
    method: string,
    params: unknown[],
  ): Promise<any> {
    const id = ++this.rpcIdCounter

    const response = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    })

    if (!response.ok) {
      throw new Error(
        `Anvil RPC HTTP ${response.status}: ${await response.text()}`,
      )
    }

    const json = await response.json()

    if (json.error) {
      throw new Error(
        `Anvil RPC error (${method}): ${json.error.message ?? JSON.stringify(json.error)}`,
      )
    }

    return json.result
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

  /** L-1: LINEA deposit. ETH on Linea comes from setup-anvil.sh base snapshot. */
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
