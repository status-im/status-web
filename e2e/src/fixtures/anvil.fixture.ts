import { test as walletTest } from './wallet-connected.fixture.js';
import { loadEnvConfig } from '@config/env.js';
import { AnvilRpcHelper } from '@helpers/anvil-rpc.js';

/**
 * Anvil fixture — extends wallet-connected for deposit tests against Anvil forks.
 *
 * Lifecycle per test:
 * 1. First test: health-check Anvil, take initial snapshots (base state)
 * 2. Each test: revert to base snapshot → re-snapshot → test-specific funding → run
 * 3. Result: every test starts from identical clean state (ETH + vaults, no tokens)
 *
 * RPC interception:
 * The Hub frontend reads chain data via its own HTTP transports (wagmi http()),
 * not through MetaMask's provider. To make the Hub see Anvil state, we intercept
 * outgoing JSON-RPC requests at the Playwright level and forward matching chains
 * (mainnet=1, Linea=59144) to the local Anvil forks. This is transparent to the
 * Hub — it thinks it's talking to the real RPC endpoints.
 *
 * Fail-fast: if Anvil is not running, tests fail immediately with a clear message.
 * Use the `anvil-deposits` Playwright project (not runtime skip).
 *
 * Prerequisites:
 * - Anvil forks running: ./scripts/setup-anvil.sh
 * - ANVIL_MAINNET_RPC + ANVIL_LINEA_RPC in e2e/.env
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

  hubPage: async ({ extensionContext, metamask, anvilRpc: _anvilRpc }, use) => {
    const env = loadEnvConfig();
    const page = await extensionContext.newPage();

    // Install RPC interception before navigating to the Hub.
    // Maps external RPC endpoint URLs to their Anvil fork equivalents.
    // Chain discovery uses two strategies:
    //   1. Parse ?chainId= query param (tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
    //   2. Probe with eth_chainId (direct RPC endpoints like Infura)
    // Result is cached per URL for the lifetime of the page.
    const rpcRedirectCache = new Map<string, string | null>();

    await page.route('**/*', async (route) => {
      const request = route.request();
      if (request.method() !== 'POST') return route.continue();

      const postData = request.postData();
      if (!postData?.includes('"jsonrpc"')) return route.continue();

      const url = request.url();
      // Never intercept extension-internal or localhost requests
      if (url.startsWith('chrome-extension:') || url.includes('localhost')) {
        return route.continue();
      }

      // Lazy-discover which chain this endpoint serves
      if (!rpcRedirectCache.has(url)) {
        // Strategy 1: extract chainId from URL query parameter
        // (e.g. tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
        const chainIdParam = new URL(url).searchParams.get('chainId');
        if (chainIdParam) {
          const chainId = Number(chainIdParam);
          if (chainId === 1) rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC);
          else if (chainId === 59144)
            rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC);
          else rpcRedirectCache.set(url, null);
        } else {
          // Strategy 2: probe with eth_chainId (direct RPC endpoints)
          try {
            const probe = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                method: 'eth_chainId',
                params: [],
                id: 1,
              }),
            });
            const json = (await probe.json()) as { result: string };
            const chainId = parseInt(json.result, 16);
            if (chainId === 1) rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC);
            else if (chainId === 59144)
              rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC);
            else rpcRedirectCache.set(url, null);
          } catch (err) {
            console.warn(`[anvil-intercept] Probe failed for ${url}: ${err}`);
            rpcRedirectCache.set(url, null);
          }
        }
      }

      const anvilUrl = rpcRedirectCache.get(url);
      if (!anvilUrl) return route.continue();

      // Forward the request to the local Anvil fork
      try {
        const res = await fetch(anvilUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: postData,
        });
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: await res.text(),
        });
      } catch {
        // Anvil unreachable — abort so the test fails loudly instead of
        // silently falling through to the real RPC (where balances are 0).
        return route.abort('connectionrefused');
      }
    });

    await page.goto(env.BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    await metamask.connectToDApp(page);

    // The Hub sends wallet_addEthereumChain for Status Network Sepolia
    // (and possibly others) right after connection. Dismiss pending
    // "Add network" popups so MetaMask is clear for tests.
    // Each empty call costs ~10s timeout; 2 popups observed currently.
    const ADD_NETWORK_POPUPS = 2;
    for (let i = 0; i < ADD_NETWORK_POPUPS; i++) {
      await metamask.dismissPendingAddNetwork();
    }

    await use(page);
  },
});