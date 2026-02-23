import { test as walletTest } from './wallet-connected.fixture.js';
import { chromium } from '@playwright/test';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { loadEnvConfig } from '@config/env.js';
import { AnvilRpcHelper } from '@helpers/anvil-rpc.js';
import { VIEWPORT } from '@constants/timeouts.js';

/**
 * Anvil fixture — extends wallet-connected for deposit tests against Anvil forks.
 *
 * Lifecycle per test:
 * 1. First test: health-check Anvil, take initial snapshots (base state)
 * 2. Each test: revert to base snapshot → re-snapshot → test-specific funding → run
 * 3. Result: every test starts from identical clean state (ETH + vaults, no tokens)
 *
 * RPC interception (two layers):
 *
 *   Layer 1 — Service worker fetch() patch (file-level, before LavaMoat):
 *   MetaMask v13 (MV3) uses a service worker for ALL internal RPC calls: gas
 *   estimation, tx simulation, balance queries, nonce lookups. Playwright's
 *   context.route() does NOT intercept service-worker-initiated fetch() calls,
 *   and Worker.evaluate() is blocked by MetaMask's LavaMoat scuttling.
 *   We prepend a fetch wrapper to MetaMask's service worker entry point
 *   (scripts/app-init.js) BEFORE launching the browser, so it runs before
 *   LavaMoat locks down globals. The wrapper redirects mainnet/Linea RPC
 *   requests to the local Anvil forks.
 *
 *   Layer 2 — Context-level route (via context.route):
 *   The Hub frontend reads chain data via its own HTTP transports (wagmi http()),
 *   not through MetaMask's provider. These page-level requests ARE caught by
 *   context.route(). We intercept and forward matching chains to Anvil.
 *
 * Fail-fast: if Anvil is not running, tests fail immediately with a clear message.
 * Use the `anvil-deposits` Playwright project (not runtime skip).
 *
 * Prerequisites:
 * - Anvil forks running: ./scripts/setup-anvil.sh
 * - ANVIL_MAINNET_RPC + ANVIL_LINEA_RPC in e2e/.env
 */

const PATCH_MARKER = '/* __ANVIL_RPC_PATCH__ */';

/**
 * Generate the JavaScript patch to prepend to MetaMask's service worker.
 * This wraps globalThis.fetch to redirect mainnet/Linea RPC requests to Anvil.
 * Must run BEFORE LavaMoat's lockdown (which scuttles unused globals).
 */
function buildServiceWorkerPatch(mainnetRpc: string, lineaRpc: string): string {
  // IMPORTANT: This code runs in MetaMask's service worker BEFORE LavaMoat.
  // LavaMoat scuttles many globalThis properties (URL, Intl, etc.) after loading.
  // We MUST NOT reference any potentially-scuttled globals — use only primitives,
  // string operations, and the fetch reference captured before LavaMoat runs.
  return `${PATCH_MARKER}
(function() {
  var _f = globalThis.fetch;
  var _c = {};
  var _m = { '1': '${mainnetRpc}', '59144': '${lineaRpc}' };
  var _tx = {};

  function _txHashFromBody(body) {
    if (!body || typeof body !== 'string') return null;
    var m = body.match(/"params"\\s*:\\s*\\[\\s*"(0x[a-fA-F0-9]{64})"/);
    return m ? m[1].toLowerCase() : null;
  }

  function _isReceiptRequest(body) {
    return !!(body && typeof body === 'string'
      && (body.indexOf('"method":"eth_getTransactionReceipt"') !== -1
        || body.indexOf('"method":"eth_getTransactionByHash"') !== -1));
  }

  function _rememberTxHash(anvilUrl, response) {
    try {
      var c = response.clone();
      return c.text().then(function(text) {
        var m = text.match(/"result"\\s*:\\s*"(0x[a-fA-F0-9]{64})"/);
        if (m) _tx[m[1].toLowerCase()] = anvilUrl;
        return response;
      }).catch(function() {
        return response;
      });
    } catch (_) {
      return Promise.resolve(response);
    }
  }

  // Forward a request to an Anvil fork URL. After eth_sendRawTransaction calls,
  // fire an evm_mine to ensure the tx is mined. Anvil's auto-mining has a timing
  // issue where txs submitted in rapid succession (e.g. wrap → approve → deposit)
  // can get stuck in the mempool. The explicit mine guarantees mining.
  function _fwd(anvilUrl, init) {
    var p = _f(anvilUrl, init);
    if (init && init.body && typeof init.body === 'string'
        && init.body.indexOf('eth_sendRawTransaction') !== -1) {
      return p.then(function(res) {
        return _rememberTxHash(anvilUrl, res).then(function(r) {
          _f(anvilUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '{"jsonrpc":"2.0","method":"evm_mine","params":[],"id":99998}'
          }).catch(function() {});
          return r;
        });
      });
    }
    return p;
  }

  function _hasNonNullRpcResult(response) {
    try {
      var c = response.clone();
      return c.text().then(function(text) {
        return text.indexOf('"result":null') === -1
          && text.indexOf('"result" : null') === -1;
      }).catch(function() {
        return false;
      });
    } catch (_) {
      return Promise.resolve(false);
    }
  }

  // Receipt polling may hit the wrong fork after network switches.
  // Query preferred fork first, then fall back to the other fork when
  // receipt/tx lookup returns {"result": null}.
  function _fwdReceiptWithFallback(init, preferredAnvilUrl) {
    var main = _m['1'];
    var linea = _m['59144'];
    var first = preferredAnvilUrl || main;
    var second = first === linea ? main : linea;
    if (!first) return _fwd(linea, init);
    if (!second || second === first) return _fwd(first, init);

    return _fwd(first, init).then(function(r1) {
      return _hasNonNullRpcResult(r1).then(function(ok1) {
        if (ok1) return r1;
        return _fwd(second, init).then(function(r2) {
          return _hasNonNullRpcResult(r2).then(function(ok2) {
            return ok2 ? r2 : r1;
          });
        });
      });
    });
  }

  globalThis.fetch = function(input, init) {
    // Intercept MetaMask Smart Transactions relay API.
    // MetaMask may route txs through its relay (transaction.api.cx.metamask.io)
    // even when STX opt-in is patched to false (onboarding overrides in storage).
    // The relay submits to real mainnet, not Anvil, so txs never mine locally.
    //
    // Strategy: instead of blocking (which causes MetaMask to mark txs as failed
    // without falling back to direct RPC), we REDIRECT tx submissions to Anvil
    // and return fake success responses. This ensures txs are mined locally
    // regardless of whether MetaMask uses STX or direct RPC.
    var _url = (typeof input === 'string') ? input
             : (input && input.url) ? input.url : '' + input;
    if (_url.indexOf('transaction.api') !== -1
        || _url.indexOf('smart-transactions') !== -1) {
      return _f('http://localhost:1/__stx_blocked__').catch(function() {
        throw new TypeError('Network request failed');
      });
    }

    // Handle Request objects: MetaMask may call fetch(request) or
    // fetch(request, { signal }) where method/body are in the Request,
    // not in the init object. Decompose into (url, init) form.
    if (typeof input !== 'string' && input && typeof input.clone === 'function') {
      var reqMethod = (init && init.method) || input.method || 'GET';
      if (reqMethod !== 'POST') return _f.apply(globalThis, arguments);
      var _inp = input;
      var _ini = init;
      return _inp.clone().text().then(function(body) {
        if (body.indexOf('"jsonrpc"') === -1) return _f(_inp, _ini);
        if (body.indexOf('"method":"linea_') !== -1) return _f(_inp, _ini);
        var isReceipt = _isReceiptRequest(body);
        var txh = _txHashFromBody(body);
        if (isReceipt) {
          var n1 = { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } };
          if (_ini) { for (var k1 in _ini) { if (!(k1 in n1)) n1[k1] = _ini[k1]; } }
          return _fwdReceiptWithFallback(n1, txh && _tx[txh] ? _tx[txh] : null);
        }
        var ni = { method: 'POST', body: body, headers: { 'Content-Type': 'application/json' } };
        if (_ini) { for (var k in _ini) { if (!(k in ni)) ni[k] = _ini[k]; } }
        return globalThis.fetch(_inp.url || ('' + _inp), ni);
      });
    }

    var url;
    if (typeof input === 'string') { url = input; }
    else if (input && input.url) { url = input.url; }
    else { url = '' + input; }

    if (!init || init.method !== 'POST' || typeof init.body !== 'string'
        || init.body.indexOf('"jsonrpc"') === -1) {
      return _f.apply(globalThis, arguments);
    }

    var txh2 = _txHashFromBody(init.body);
    if (_isReceiptRequest(init.body)) {
      return _fwdReceiptWithFallback(init, txh2 && _tx[txh2] ? _tx[txh2] : null);
    }

    // Keep Linea custom RPC methods on the upstream provider.
    // Mapping them to eth_* breaks fee calculations for tx submissions.
    if (init.body.indexOf('"method":"linea_') !== -1) {
      return _f.apply(globalThis, arguments);
    }

    if (url.indexOf('chrome-extension:') === 0
        || url.indexOf('localhost') !== -1
        || url.indexOf('127.0.0.1') !== -1) {
      return _f.apply(globalThis, arguments);
    }

    if (url in _c) {
      var cached = _c[url];
      if (typeof cached === 'string') return _fwd(cached, init);
      if (cached === null) return _f.apply(globalThis, arguments);
      return cached.then(function(u) {
        return u ? _fwd(u, init) : _f(url, init);
      });
    }

    var ci = url.match(/[?&]chainId=(\\d+)/);
    if (ci) {
      _c[url] = _m[ci[1]] || null;
      return _c[url] ? _fwd(_c[url], init) : _f.apply(globalThis, arguments);
    }

    var probe = _f(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"jsonrpc":"2.0","method":"eth_chainId","params":[],"id":99999}'
    }).then(function(r) { return r.json(); })
      .then(function(j) {
        var cid = '' + parseInt(j.result, 16);
        _c[url] = _m[cid] || null;
        return _c[url];
      })
      .catch(function() { _c[url] = null; return null; });

    _c[url] = probe;
    return probe.then(function(u) {
      return u ? _fwd(u, init) : _f(url, init);
    });
  };
})();
`;
}

// Module-level snapshot storage — persists across tests within the same worker.
// Safe because workers: 1 (MetaMask extension is singleton).
let baseSnapshots: { mainnet: string; linea: string } | null = null;

// Track original service worker content for cleanup
let originalSwContent: string | null = null;
let swFilePath: string | null = null;

// Track files patched for Smart Transactions disabling
const stxPatchedFiles: Array<{ path: string; original: string }> = [];

/**
 * Disable MetaMask's Smart Transactions by patching extension source files.
 * Smart Transactions routes txs through MetaMask's relay service, which breaks
 * Anvil-based testing (txs confirmed on Anvil appear as "Pending" forever).
 *
 * We can't use MetaMask's UI to toggle the setting because:
 * - page.goto() causes MetaMask to lock (shows "Enter your password")
 * - page.evaluate() is blocked by LavaMoat's scuttling mode
 *
 * Instead, we patch the compiled JS files to set the default opt-in to false
 * BEFORE the browser reads them. Files are restored in cleanup.
 */
function disableSmartTransactionsInFiles(extensionPath: string): void {
  const optInDefaultPattern = /smartTransactionsOptInStatus:!0/g;
  const txSimulationsPattern = /useTransactionSimulations:!0/g;
  const stxPublishHookPattern =
    'const{isSmartTransaction:c,featureFlags:l}=(0,h.getSmartTransactionCommonParams)(e,o.chainId),u=await(0,m.isSendBundleSupported)(o.chainId)';
  const stxPublishHookReplacement =
    'const{featureFlags:l}=(0,h.getSmartTransactionCommonParams)(e,o.chainId),c=!1,u=await(0,m.isSendBundleSupported)(o.chainId)';

  const filePatchers: Array<{
    fileName: string;
    transform: (content: string) => string;
  }> = [
    // Default STX opt-in state used by initial controller state.
    {
      fileName: 'common-0.js',
      transform: (content) =>
        content
          .replace(optInDefaultPattern, 'smartTransactionsOptInStatus:!1')
          .replace(txSimulationsPattern, 'useTransactionSimulations:!1'),
    },
    {
      fileName: 'common-14.js',
      transform: (content) =>
        content.replace(optInDefaultPattern, 'smartTransactionsOptInStatus:!1'),
    },
    {
      fileName: 'background-1.js',
      transform: (content) =>
        content
          .replace(optInDefaultPattern, 'smartTransactionsOptInStatus:!1')
          .replace(txSimulationsPattern, 'useTransactionSimulations:!1'),
    },
    {
      fileName: 'background-7.js',
      transform: (content) =>
        content.replace(optInDefaultPattern, 'smartTransactionsOptInStatus:!1'),
    },
    // Hard-disable STX routing in tx publish hook for MetaMask v13.18.1.
    // Onboarding can override preference defaults in storage, so this patch
    // guarantees direct publish path for tx submission.
    {
      fileName: 'background-5.js',
      transform: (content) =>
        content.replace(stxPublishHookPattern, stxPublishHookReplacement),
    },
  ];

  for (const { fileName, transform } of filePatchers) {
    const filePath = path.join(extensionPath, fileName);
    if (!fs.existsSync(filePath)) continue;

    const original = fs.readFileSync(filePath, 'utf-8');
    const patched = transform(original);

    if (patched !== original) {
      stxPatchedFiles.push({ path: filePath, original });
      fs.writeFileSync(filePath, patched);
    }
  }
}

/** Restore all files patched by disableSmartTransactionsInFiles */
function restoreSmartTransactionsFiles(): void {
  for (const { path: filePath, original } of stxPatchedFiles) {
    fs.writeFileSync(filePath, original);
  }
  stxPatchedFiles.length = 0;
}

export const test = walletTest.extend<{ anvilRpc: AnvilRpcHelper }>({
  // Override extensionContext to patch MetaMask's service worker before launch.
  // The parent fixture (metamask.fixture) launches the browser with MetaMask
  // loaded, but we need to modify the extension files BEFORE the browser reads
  // them. This requires duplicating the browser launch logic.
  extensionContext: async ({}, use) => {
    const env = loadEnvConfig();
    const extensionPath = env.METAMASK_EXTENSION_PATH;

    if (!fs.existsSync(extensionPath)) {
      throw new Error(
        `MetaMask extension not found at ${extensionPath}. Run "pnpm setup:metamask" first.`,
      );
    }

    // ── Patch MetaMask's service worker before browser launch ──
    swFilePath = path.join(extensionPath, 'scripts', 'app-init.js');
    const currentContent = fs.readFileSync(swFilePath, 'utf-8');

    if (currentContent.includes(PATCH_MARKER)) {
      // Already patched (previous run didn't clean up) — strip old patch
      // Find the end of the IIFE: })();\n
      const patchEnd = currentContent.indexOf('})();\n');
      if (patchEnd !== -1) {
        originalSwContent = currentContent.slice(patchEnd + '})();\n'.length);
      } else {
        originalSwContent = currentContent;
      }
    } else {
      originalSwContent = currentContent;
    }

    if (env.ANVIL_MAINNET_RPC && env.ANVIL_LINEA_RPC) {
      const patch = buildServiceWorkerPatch(env.ANVIL_MAINNET_RPC, env.ANVIL_LINEA_RPC);
      fs.writeFileSync(swFilePath, patch + originalSwContent);
    }

    // ── Disable Smart Transactions in MetaMask's compiled files ──
    // Must happen BEFORE browser launch so MetaMask reads the patched defaults.
    disableSmartTransactionsInFiles(extensionPath);

    // ── Launch browser (same as parent metamask.fixture) ──
    const profileDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'pw-metamask-'),
    );

    const context = await chromium.launchPersistentContext(profileDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-first-run',
        '--disable-default-apps',
      ],
      viewport: { width: VIEWPORT.WIDTH, height: VIEWPORT.HEIGHT },
    });

    await use(context);

    await context.close();
    fs.rmSync(profileDir, { recursive: true, force: true });

    // ── Restore patched extension files ──
    if (originalSwContent !== null && swFilePath) {
      fs.writeFileSync(swFilePath, originalSwContent);
    }
    restoreSmartTransactionsFiles();
  },

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

    // Force auto-mining on both forks before each test.
    // We observed intermittent cases where interval mining leaves the second
    // tx (approve -> deposit flow) pending with null receipt indefinitely.
    // Auto-mining keeps transaction confirmation deterministic for UI polling.
    await helper.enableAutoMining();
    await helper.enableAutoMining(helper.lineaRpc);

    await use(helper);
  },

  hubPage: async ({ extensionContext, metamask, anvilRpc: _anvilRpc }, use) => {
    const env = loadEnvConfig();

    // ── Context-level route for Hub page requests ──────────────────────
    //
    // The Hub frontend makes RPC calls via its own HTTP transports (wagmi
    // public client → tRPC proxy or direct RPC endpoints). These are page-
    // level fetch() calls that context.route() CAN intercept.
    //
    // MetaMask's service worker requests are handled by Layer 1 (the file-
    // level fetch patch applied before browser launch).
    //
    // Chain discovery uses two strategies:
    //   1. Parse ?chainId= query param (tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
    //   2. Probe with eth_chainId (direct RPC endpoints like Infura)
    // Result is cached per URL for the lifetime of the context.
    const rpcRedirectCache = new Map<string, string | null>();
    const txReceiptMethodPattern = /"method"\s*:\s*"eth_getTransactionReceipt"/;

    const hasNonNullRpcResult = (responseBody: string): boolean => {
      try {
        const parsed = JSON.parse(responseBody) as
          | { result?: unknown }
          | Array<{ result?: unknown }>;
        if (Array.isArray(parsed)) {
          return parsed.some((item) => item && item.result !== null && item.result !== undefined);
        }
        return parsed.result !== null && parsed.result !== undefined;
      } catch {
        return false;
      }
    };

    const forwardRpcToAnvil = async (anvilUrl: string, body: string) => {
      const res = await fetch(anvilUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      });
      return {
        status: res.status,
        body: await res.text(),
      };
    };

    await extensionContext.route('**/*', async (route) => {
      const request = route.request();
      if (request.method() !== 'POST') return route.continue();

      const postData = request.postData();
      if (!postData?.includes('"jsonrpc"')) return route.continue();
      // Keep Linea-specific RPC methods on upstream providers to preserve
      // provider-specific response format used for fee calculation.
      if (postData.includes('"method":"linea_')) return route.continue();

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

      // eth_getTransactionReceipt requests can be misrouted after network
      // switches. If the primary fork returns null, fall back to the other
      // fork before returning the response.
      const isTxReceiptRequest = txReceiptMethodPattern.test(postData);
      const fallbackAnvilUrl =
        anvilUrl === env.ANVIL_LINEA_RPC ? env.ANVIL_MAINNET_RPC : env.ANVIL_LINEA_RPC;

      try {
        const primary = await forwardRpcToAnvil(anvilUrl, postData);

        if (!isTxReceiptRequest) {
          return route.fulfill({
            status: primary.status,
            contentType: 'application/json',
            body: primary.body,
          });
        }

        if (primary.status === 200 && hasNonNullRpcResult(primary.body)) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: primary.body,
          });
        }

        const fallback = await forwardRpcToAnvil(fallbackAnvilUrl, postData);
        if (fallback.status === 200 && hasNonNullRpcResult(fallback.body)) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: fallback.body,
          });
        }

        // Preserve original semantics when both forks return null/pending.
        return route.fulfill({
          status: primary.status,
          contentType: 'application/json',
          body: primary.body,
        });
      } catch {
        // Anvil unreachable — abort so the test fails loudly instead of
        // silently falling through to the real RPC (where balances are 0).
        return route.abort('connectionrefused');
      }
    });

    const page = await extensionContext.newPage();

    // Debug: capture Hub page errors and warnings for diagnosis
    page.on('pageerror', (error) => {
      console.log(`[HUB PAGE ERROR] ${error.message}`);
    });
    page.on('console', (msg) => {
      if (msg.type() === 'error' || msg.type() === 'warning') {
        console.log(`[HUB ${msg.type().toUpperCase()}] ${msg.text()}`);
      }
    });

    await page.goto(env.BASE_URL);
    await page.waitForLoadState('domcontentloaded');

    // Block wallet_addEthereumChain requests BEFORE connecting to MetaMask.
    // The Hub sends these immediately after connection (for Status Network Sepolia).
    // These queue up as "Add Network" popups in MetaMask and interfere with
    // transaction approvals — MetaMask shows them ahead of actual txs, and
    // handling them (cancel/navigate) can cause port disconnects that auto-reject
    // pending transactions. Blocking at the provider level prevents them from
    // ever reaching MetaMask.
    await page.evaluate(() => {
      const provider = (window as unknown as Record<string, unknown>).ethereum as {
        request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
      };
      if (!provider) return;
      const originalRequest = provider.request.bind(provider);
      provider.request = async (args: { method: string; params?: unknown[] }) => {
        if (args.method === 'wallet_addEthereumChain') {
          console.warn('[anvil-fixture] Blocked wallet_addEthereumChain request');
          // Resolve silently — MetaMask spec says null = already added
          return null;
        }
        return originalRequest(args);
      };
    });

    await metamask.connectToDApp(page);

    // The Hub may still have queued wallet_addEthereumChain before the provider
    // patch took effect (race during DOMContentLoaded). Dismiss any stragglers.
    await metamask.dismissPendingAddNetwork();

    await use(page);

    // Clean up context-level route when test finishes
    await extensionContext.unrouteAll({ behavior: 'ignoreErrors' });
  },
});
