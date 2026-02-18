/**
 * AnvilRpcHelper — JSON-RPC helper for Anvil fork state management.
 *
 * Provides:
 * - Snapshot/revert for test isolation
 * - ETH balance manipulation
 * - ERC-20 token funding via whale impersonation
 * - WETH wrapping
 *
 * All operations use raw fetch() — no external dependencies needed.
 */

// Well-known contract addresses (mainnet)
const CONTRACTS = {
  WETH: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  SNT: '0x744d70FDBE2Ba4CF95131626614a1763DF805B9E',
  USDT: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  USDS: '0xdC035D45d973E3EC169d2276DDab16f1e407384F',
} as const;

// Well-known whale addresses for ERC-20 funding
const WHALES = {
  // Binance hot wallet — holds SNT, USDT, USDC, and many others
  BINANCE: '0xF977814e90dA44bFA03b6295A0616a897441aceC',
} as const;

// Function selectors (4 bytes)
const SELECTORS = {
  // WETH.deposit()
  DEPOSIT: '0xd0e30db0',
  // ERC20.transfer(address,uint256)
  TRANSFER: '0xa9059cbb',
  // ERC20.balanceOf(address)
  BALANCE_OF: '0x70a08231',
} as const;

/** Encode an address as 32-byte ABI parameter (left-padded with zeros) */
function encodeAddress(address: string): string {
  return address.slice(2).toLowerCase().padStart(64, '0');
}

/** Encode a uint256 as 32-byte ABI parameter */
function encodeUint256(value: bigint): string {
  return value.toString(16).padStart(64, '0');
}

/** Convert bigint to hex string with 0x prefix */
function toHex(value: bigint): string {
  return '0x' + value.toString(16);
}

export interface FundingPreset {
  eth?: bigint;
  weth?: bigint;
  snt?: bigint;
  usdt?: bigint;
  usdc?: bigint;
  usds?: bigint;
}

export class AnvilRpcHelper {
  private rpcIdCounter = 0;

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
    return this.call(rpc ?? this.mainnetRpc, 'evm_snapshot', []);
  }

  /**
   * Revert to a snapshot. The snapshot is consumed (one-time use).
   * Returns true if successful.
   */
  async revert(snapshotId: string, rpc?: string): Promise<boolean> {
    return this.call(rpc ?? this.mainnetRpc, 'evm_revert', [snapshotId]);
  }

  /**
   * Take snapshots on both forks. Returns { mainnet, linea } snapshot IDs.
   */
  async snapshotBoth(): Promise<{ mainnet: string; linea: string }> {
    const [mainnet, linea] = await Promise.all([
      this.snapshot(this.mainnetRpc),
      this.snapshot(this.lineaRpc),
    ]);
    return { mainnet, linea };
  }

  /**
   * Revert both forks to their snapshots.
   */
  async revertBoth(ids: { mainnet: string; linea: string }): Promise<void> {
    await Promise.all([
      this.revert(ids.mainnet, this.mainnetRpc),
      this.revert(ids.linea, this.lineaRpc),
    ]);
  }

  // ---------------------------------------------------------------------------
  // ETH balance
  // ---------------------------------------------------------------------------

  /** Set ETH balance directly via anvil_setBalance */
  async setEthBalance(amount: bigint, rpc?: string): Promise<void> {
    await this.call(
      rpc ?? this.mainnetRpc,
      'anvil_setBalance',
      [this.walletAddress, toHex(amount)],
    );
  }

  // ---------------------------------------------------------------------------
  // ERC-20 token funding
  // ---------------------------------------------------------------------------

  /** Wrap ETH → WETH by calling WETH.deposit() with value */
  async fundWeth(amount: bigint): Promise<void> {
    await this.call(this.mainnetRpc, 'anvil_impersonateAccount', [this.walletAddress]);
    await this.call(this.mainnetRpc, 'eth_sendTransaction', [{
      from: this.walletAddress,
      to: CONTRACTS.WETH,
      data: SELECTORS.DEPOSIT,
      value: toHex(amount),
    }]);
    await this.call(this.mainnetRpc, 'anvil_stopImpersonatingAccount', [this.walletAddress]);
  }

  /** Transfer ERC-20 tokens from a whale to the test wallet */
  async fundErc20(
    token: string,
    amount: bigint,
    whale: string = WHALES.BINANCE,
    rpc?: string,
  ): Promise<void> {
    const targetRpc = rpc ?? this.mainnetRpc;
    const data = SELECTORS.TRANSFER
      + encodeAddress(this.walletAddress)
      + encodeUint256(amount);

    await this.call(targetRpc, 'anvil_impersonateAccount', [whale]);
    await this.call(targetRpc, 'eth_sendTransaction', [{
      from: whale,
      to: token,
      data,
    }]);
    await this.call(targetRpc, 'anvil_stopImpersonatingAccount', [whale]);
  }

  /** Fund SNT tokens (18 decimals) */
  async fundSnt(amount: bigint): Promise<void> {
    await this.fundErc20(CONTRACTS.SNT, amount);
  }

  /** Fund USDT tokens (6 decimals) */
  async fundUsdt(amount: bigint): Promise<void> {
    await this.fundErc20(CONTRACTS.USDT, amount);
  }

  /** Fund USDC tokens (6 decimals) */
  async fundUsdc(amount: bigint): Promise<void> {
    await this.fundErc20(CONTRACTS.USDC, amount);
  }

  /** Fund USDS tokens (18 decimals) */
  async fundUsds(amount: bigint): Promise<void> {
    await this.fundErc20(CONTRACTS.USDS, amount);
  }

  /**
   * Apply a funding preset: set ETH + fund specific tokens.
   * Designed for test.beforeEach — call after revert to set exact preconditions.
   */
  async fund(preset: FundingPreset): Promise<void> {
    if (preset.eth !== undefined) {
      await this.setEthBalance(preset.eth);
    }
    if (preset.weth !== undefined && preset.weth > 0n) {
      await this.fundWeth(preset.weth);
    }
    if (preset.snt !== undefined && preset.snt > 0n) {
      await this.fundSnt(preset.snt);
    }
    if (preset.usdt !== undefined && preset.usdt > 0n) {
      await this.fundUsdt(preset.usdt);
    }
    if (preset.usdc !== undefined && preset.usdc > 0n) {
      await this.fundUsdc(preset.usdc);
    }
    if (preset.usds !== undefined && preset.usds > 0n) {
      await this.fundUsds(preset.usds);
    }
  }

  // ---------------------------------------------------------------------------
  // Health check
  // ---------------------------------------------------------------------------

  /** Check if an Anvil RPC endpoint is reachable */
  async healthCheck(rpc?: string): Promise<boolean> {
    try {
      await this.call(rpc ?? this.mainnetRpc, 'eth_blockNumber', []);
      return true;
    } catch {
      return false;
    }
  }

  /** Check both forks are reachable. Throws with a clear message if not. */
  async requireHealthy(): Promise<void> {
    const [mainnetOk, lineaOk] = await Promise.all([
      this.healthCheck(this.mainnetRpc),
      this.healthCheck(this.lineaRpc),
    ]);

    if (!mainnetOk || !lineaOk) {
      const down = [
        !mainnetOk && `mainnet (${this.mainnetRpc})`,
        !lineaOk && `linea (${this.lineaRpc})`,
      ].filter(Boolean).join(', ');

      throw new Error(
        `Anvil fork(s) not reachable: ${down}. ` +
        'Start them with: cd e2e && ./scripts/setup-anvil.sh',
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Raw RPC
  // ---------------------------------------------------------------------------

  private async call(rpc: string, method: string, params: unknown[]): Promise<any> {
    const id = ++this.rpcIdCounter;

    const response = await fetch(rpc, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id, method, params }),
    });

    if (!response.ok) {
      throw new Error(`Anvil RPC HTTP ${response.status}: ${await response.text()}`);
    }

    const json = await response.json();

    if (json.error) {
      throw new Error(`Anvil RPC error (${method}): ${json.error.message ?? JSON.stringify(json.error)}`);
    }

    return json.result;
  }
}

// ---------------------------------------------------------------------------
// Common funding presets (convenience constants)
// ---------------------------------------------------------------------------

const ETH = 10n ** 18n;
const USDT_UNIT = 10n ** 6n;
const USDC_UNIT = 10n ** 6n;

/** Presets matching test scenarios from DEPOSIT_TESTS_PLAN.md */
export const FUNDING_PRESETS = {
  /** W-1: Wrap ETH flow. No WETH, only ETH. */
  WETH_WRAP: { eth: 2n * ETH } satisfies FundingPreset,

  /** W-2: Sufficient WETH for direct deposit. */
  WETH_SUFFICIENT: { eth: 1n * ETH, weth: ETH / 100n } satisfies FundingPreset, // 0.01 WETH

  /** W-3: Partial wrap. Some WETH + enough ETH to wrap the rest. */
  WETH_PARTIAL: { eth: 1n * ETH, weth: ETH / 200n } satisfies FundingPreset, // 0.005 WETH

  /** W-4: Below minimum validation. Need balance > 0.0005 to pass balance check. */
  WETH_BELOW_MIN: { eth: 1n * ETH } satisfies FundingPreset,

  /** S-1: SNT deposit. */
  SNT_DEPOSIT: { eth: 1n * ETH, snt: 100n * ETH } satisfies FundingPreset, // 100 SNT

  /** S-2: SNT below minimum. Need SNT > 0.5 to pass balance check. */
  SNT_BELOW_MIN: { eth: 1n * ETH, snt: 1n * ETH } satisfies FundingPreset, // 1 SNT

  /** G-1: GUSD deposit via USDT. */
  GUSD_USDT: { eth: 1n * ETH, usdt: 100n * USDT_UNIT } satisfies FundingPreset,

  /** G-2: GUSD deposit via USDC. */
  GUSD_USDC: { eth: 1n * ETH, usdc: 100n * USDC_UNIT } satisfies FundingPreset,

  /** G-3: GUSD deposit via USDS. */
  GUSD_USDS: { eth: 1n * ETH, usds: 100n * ETH } satisfies FundingPreset,

  /** Generic: just ETH for gas (validation tests that only need a connected wallet). */
  ETH_ONLY: { eth: 10n * ETH } satisfies FundingPreset,
} as const;