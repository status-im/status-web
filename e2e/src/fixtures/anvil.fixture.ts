import { test as walletTest } from './wallet-connected.fixture.js';
import { loadEnvConfig } from '@config/env.js';
import { AnvilRpcHelper } from '../helpers/anvil-rpc.js';

/**
 * Anvil fixture — extends wallet-connected for deposit tests against Anvil forks.
 *
 * Lifecycle per test:
 * 1. First test: health-check Anvil, take initial snapshots (base state)
 * 2. Each test: revert to base snapshot → re-snapshot → test-specific funding → run
 * 3. Result: every test starts from identical clean state (ETH + vaults, no tokens)
 *
 * Fail-fast: if Anvil is not running, tests fail immediately with a clear message.
 * Use the `anvil-deposits` Playwright project (not runtime skip).
 *
 * Prerequisites:
 * - Anvil forks running: ./scripts/setup-anvil.sh
 * - ANVIL_MAINNET_RPC + ANVIL_LINEA_RPC in e2e/.env
 * - Hub running with NEXT_PUBLIC_MAINNET_RPC_URL / NEXT_PUBLIC_LINEA_RPC_URL
 */

// Module-level snapshot storage — persists across tests within the same worker.
// Safe because workers: 1 (MetaMask extension is singleton).
let baseSnapshots: { mainnet: string; linea: string } | null = null;

export const test = walletTest.extend<{ anvilRpc: AnvilRpcHelper }>({
  anvilRpc: async ({}, use) => {
    const env = loadEnvConfig();

    if (!env.ANVIL_MAINNET_RPC || !env.ANVIL_LINEA_RPC) {
      throw new Error(
        'ANVIL_MAINNET_RPC and ANVIL_LINEA_RPC must be set for anvil-deposits tests. ' +
        'Run: ./scripts/setup-anvil.sh and configure e2e/.env',
      );
    }

    const walletAddress = env.WALLET_ADDRESS;
    if (!walletAddress) {
      throw new Error(
        'WALLET_ADDRESS must be set for anvil-deposits tests. ' +
        'Derive it with: cast wallet address --mnemonic "$WALLET_SEED_PHRASE" --mnemonic-index 0',
      );
    }

    const helper = new AnvilRpcHelper(
      env.ANVIL_MAINNET_RPC,
      env.ANVIL_LINEA_RPC,
      walletAddress,
    );

    // First test in the run: verify Anvil is healthy and take base snapshots
    if (!baseSnapshots) {
      await helper.requireHealthy();
      baseSnapshots = await helper.snapshotBoth();
    } else {
      // Subsequent tests: revert to clean state
      await helper.revertBoth(baseSnapshots);
      // Re-snapshot immediately (revert consumes the snapshot)
      baseSnapshots = await helper.snapshotBoth();
    }

    await use(helper);
  },

  hubPage: async ({ extensionContext, metamask, anvilRpc }, use) => {
    const env = loadEnvConfig();

    // Configure MetaMask to use Anvil RPC endpoints
    const page = await extensionContext.newPage();
    await page.goto(env.BASE_URL);

    // Try programmatic RPC approach for each chain
    if (env.ANVIL_MAINNET_RPC) {
      const added = await metamask.settings.tryAddNetworkViaRpc(page, {
        chainId: '0x1',
        chainName: 'Ethereum Mainnet',
        rpcUrl: env.ANVIL_MAINNET_RPC,
        currencySymbol: 'ETH',
        blockExplorerUrl: 'https://etherscan.io',
      });

      if (!added) {
        // Fallback: MetaMask Settings UI
        await metamask.settings.addCustomRpcToNetwork(
          'Ethereum Mainnet',
          env.ANVIL_MAINNET_RPC,
        );
      }
    }

    if (env.ANVIL_LINEA_RPC) {
      const added = await metamask.settings.tryAddNetworkViaRpc(page, {
        chainId: '0xe708', // 59144
        chainName: 'Linea',
        rpcUrl: env.ANVIL_LINEA_RPC,
        currencySymbol: 'ETH',
        blockExplorerUrl: 'https://lineascan.build',
      });

      if (!added) {
        await metamask.settings.addCustomRpcToNetwork(
          'Linea',
          env.ANVIL_LINEA_RPC,
        );
      }
    }

    await metamask.connectToDApp(page);
    await use(page);
  },
});

export { expect } from '@playwright/test';