import { loadEnvConfig } from '@config/env.js'
import { VIEWPORT } from '@constants/timeouts.js'
import { AnvilRpcHelper } from '@helpers/anvil-rpc.js'
import { chromium } from '@playwright/test'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

import { test as walletTest } from './hub/wallet-connected.fixture.js'

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

const PATCH_MARKER = '/* __ANVIL_RPC_PATCH__ */'

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
  var _R = globalThis.Response;  // capture before LavaMoat scuttles it
  var _c = {};
  var _m = { '1': '${mainnetRpc}', '59144': '${lineaRpc}' };
  var _tx = {};
  var _stxCounter = 0;
  var _stxHashes = {};  // STX uuid → mined tx hash (from Anvil)

  // Mock linea_estimateGas to return instant fixed values.
  // MetaMask fires this to the real Linea RPC during the confirmation page;
  // the async response arrival triggers a re-render that detaches the Confirm
  // button DOM element mid-click. Returning instantly eliminates the race.
  function _mockLineaEstimateGas(body) {
    var idMatch = body.match(/"id"\\s*:\\s*(\\d+)/);
    var id = idMatch ? idMatch[1] : '1';
    return Promise.resolve(new _R(
      '{"jsonrpc":"2.0","id":' + id + ',"result":{"baseFeePerGas":"0x7","priorityFeePerGas":"0x3b9aca00","gasLimit":"0x7A120"}}',
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));
  }

  // Hostname-based chain detection — avoids eth_chainId probes that can fail
  // on Infura/Alchemy URLs with API keys in path segments.
  var _mainnetHosts = ['mainnet.infura.io','eth.merkle.io','ethereum-rpc.publicnode.com',
    'cloudflare-eth.com','eth-mainnet.g.alchemy.com','rpc.ankr.com','1rpc.io'];
  var _lineaHosts = ['rpc.linea.build','linea-mainnet.infura.io','linea.drpc.org',
    'linea-mainnet.quiknode.pro'];
  function _chainByHost(u) {
    // Check Linea FIRST — 'linea-mainnet.infura.io' contains 'mainnet.infura.io'
    // as a substring, so checking mainnet first would misclassify Linea URLs.
    for (var j = 0; j < _lineaHosts.length; j++) { if (u.indexOf(_lineaHosts[j]) !== -1) return '59144'; }
    for (var i = 0; i < _mainnetHosts.length; i++) { if (u.indexOf(_mainnetHosts[i]) !== -1) return '1'; }
    return null;
  }

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
  // fire-and-forget evm_mine as a safety net (Anvil auto-mines, but this ensures
  // mining even if auto-mine is somehow disabled). Fire-and-forget is critical:
  // awaiting evm_mine blocks the service worker fetch response, causing MetaMask
  // timeouts across the board.
  var _mineInit = { method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: '{"jsonrpc":"2.0","method":"evm_mine","params":[],"id":99998}' };
  function _fwd(anvilUrl, init) {
    var p = _f(anvilUrl, init);
    if (init && init.body && typeof init.body === 'string'
        && init.body.indexOf('eth_sendRawTransaction') !== -1) {
      return p.then(function(res) {
        return _rememberTxHash(anvilUrl, res).then(function(r) {
          _f(anvilUrl, _mineInit).catch(function() {});
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
  // receipt/tx lookup returns {"result": null}. If both return null,
  // return the original response (MetaMask will retry on its own).
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
        || _url.indexOf('smart-transactions') !== -1
        || _url.indexOf('tx-sentinel') !== -1) {
      // Intercept MetaMask Smart Transactions API requests.
      // Instead of blocking (which causes MetaMask to mark txs as "Failed"
      // without falling back to direct RPC on Linea), return fake success
      // responses for all STX endpoints. Raw txs are forwarded to Anvil
      // so they get mined locally.

      // A. submitTransactions — forward raw txs to Anvil, return fake uuid
      try {
        var _stxBody = (init && init.body && typeof init.body === 'string') ? init.body : '';
        if (_stxBody && _stxBody.indexOf('rawTxs') !== -1) {
          var _cidMatch = _url.match(/\\/networks\\/(\\d+)\\//);
          var _cidQueryMatch = _url.match(/[?&]chainId=(\\d+)/);
          var _stxChainId = _cidMatch ? _cidMatch[1] : (_cidQueryMatch ? _cidQueryMatch[1] : null);
          var _stxTargets = [];
          if (_stxChainId && _m[_stxChainId]) {
            _stxTargets.push(_m[_stxChainId]);
          } else {
            if (_m['1']) _stxTargets.push(_m['1']);
            if (_m['59144'] && _m['59144'] !== _m['1']) _stxTargets.push(_m['59144']);
          }
          var _txListMatch = _stxBody.match(/"rawTxs"\\s*:\\s*\\[([^\\]]+)\\]/);
          var _fakeUuid = 'anvil-stx-' + Date.now() + '-' + (++_stxCounter);
          if (_txListMatch && _stxTargets.length) {
            // Forward raw txs to Anvil and capture the mined tx hash.
            // We wait for Anvil to respond so the hash is available when
            // MetaMask polls batchStatus (which it does immediately after).
            var _hexRegex = /"(0x[a-fA-F0-9]+)"/g;
            var _hm;
            var _fwdPromises = [];
            while ((_hm = _hexRegex.exec(_txListMatch[1])) !== null) {
              for (var _ti = 0; _ti < _stxTargets.length; _ti++) {
                _fwdPromises.push(
                  _fwd(_stxTargets[_ti], {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["' + _hm[1] + '"],"id":99997}'
                  }).then(function(res) {
                    return res.clone().text().then(function(text) {
                      var hm = text.match(/"result"\\s*:\\s*"(0x[a-fA-F0-9]{64})"/);
                      return hm ? hm[1] : null;
                    });
                  }).catch(function() { return null; })
                );
              }
            }
            // Wait for all Anvil responses, store the first valid tx hash
            return Promise.all(_fwdPromises).then(function(hashes) {
              for (var _hi = 0; _hi < hashes.length; _hi++) {
                if (hashes[_hi]) { _stxHashes[_fakeUuid] = hashes[_hi]; break; }
              }
              return new _R('{"uuid":"' + _fakeUuid + '"}', {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
              });
            });
          }
          // No raw txs found — return uuid immediately
          return Promise.resolve(new _R('{"uuid":"' + _fakeUuid + '"}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      } catch (_stxErr) {}

      // B. batchStatus — return fake status for all queried uuids.
      // MetaMask polls this to check STX tx status after submission.
      // Response MUST be an object keyed by UUID (MetaMask uses Object.entries).
      // Each value needs minedTx + minedHash for MetaMask to confirm the tx.
      if (_url.indexOf('batchStatus') !== -1) {
        var _uuidsMatch = _url.match(/[?&]uuids=([^&]+)/);
        if (_uuidsMatch) {
          try {
            var _uuidList = decodeURIComponent(_uuidsMatch[1]).split(',');
            var _statusJson = '{';
            for (var _si = 0; _si < _uuidList.length; _si++) {
              if (_si > 0) _statusJson += ',';
              var _uid = _uuidList[_si];
              var _hash = _stxHashes[_uid];
              if (_hash) {
                _statusJson += '"' + _uid + '":{"minedTx":"success","minedHash":"' + _hash + '","cancellationReason":"not_cancelled"}';
              } else {
                // Hash not ready yet — return pending so MetaMask retries
                _statusJson += '"' + _uid + '":{"minedTx":"not_mined","cancellationReason":"not_cancelled"}';
              }
            }
            _statusJson += '}';
            return Promise.resolve(new _R(_statusJson, {
              status: 200,
              headers: { 'Content-Type': 'application/json' }
            }));
          } catch (_bsErr) {}
        }
      }

      // C. All other STX API calls (liveness, fees, network info) —
      // return empty success to prevent MetaMask from erroring out.
      return Promise.resolve(new _R('{}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
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
        if (body.indexOf('"method":"linea_estimateGas"') !== -1) return _mockLineaEstimateGas(body);
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
      var _rxPref = txh2 && _tx[txh2] ? _tx[txh2] : null;
      return _fwdReceiptWithFallback(init, _rxPref);
    }

    // Mock linea_estimateGas to return instant fixed values (eliminates
    // MetaMask re-render race condition). Other linea_* methods still
    // pass through to the upstream provider — mapping them to eth_*
    // breaks fee calculations for tx submissions.
    if (init.body.indexOf('"method":"linea_estimateGas"') !== -1) {
      return _mockLineaEstimateGas(init.body);
    }
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
      if (typeof cached === 'string') {
        return _fwd(cached, init);
      }
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

    // Hostname-based chain detection — no network needed
    var _hc = _chainByHost(url);
    if (_hc) {
      _c[url] = _m[_hc] || null;
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
`
}

// Module-level snapshot storage — persists across tests within the same worker.
// Safe because workers: 1 (MetaMask extension is singleton).
let baseSnapshots: { mainnet: string; linea: string } | null = null

// Track original service worker content for cleanup
let originalSwContent: string | null = null
let swFilePath: string | null = null

// Track files patched for Smart Transactions disabling
const stxPatchedFiles: Array<{ path: string; original: string }> = []

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
 *
 * Patches are idempotent: they match both the original (!0) and already-patched
 * (!1) values. If a previous run crashed without restoring, the file is already
 * in the target state and the "true original" is recovered via reverse transform.
 */
function disableSmartTransactionsInFiles(extensionPath: string): void {
  // Match both !0 (original) and !1 (already patched) for idempotency.
  const optInPattern = /smartTransactionsOptInStatus:![01]/g
  const txSimulationsPattern = /useTransactionSimulations:![01]/g

  // Regex-based patterns for the STX publish hooks in background-5.js.
  // Uses capture groups for variable names so it works regardless of minification.

  const singleTxHookRegex =
    /const\{isSmartTransaction:(\w+),featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\),(\w+)=await\(0,(\w+)\.isSendBundleSupported\)/g
  const singleTxHookReplacement =
    'const{featureFlags:$2}=(0,$3.getSmartTransactionCommonParams)($4,$5.chainId),$1=!1,$6=await(0,$7.isSendBundleSupported)'

  const batchTxHookRegex =
    /const\{isSmartTransaction:(\w+),featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\);return \1\?/g
  const batchTxHookReplacement =
    'const{isSmartTransaction:$1,featureFlags:$2}=(0,$3.getSmartTransactionCommonParams)($4,$5.chainId);return !1?'

  // Reverse transforms — used to recover the "true original" from already-patched files.
  // The patched form uses a known structure that can be reversed back to the original pattern.
  const singleTxHookPatchedRegex =
    /const\{featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\),(\w+)=!1,(\w+)=await\(0,(\w+)\.isSendBundleSupported\)/g
  const singleTxHookReverse =
    'const{isSmartTransaction:$5,featureFlags:$1}=(0,$2.getSmartTransactionCommonParams)($3,$4.chainId),$6=await(0,$7.isSendBundleSupported)'

  const batchTxHookPatchedRegex =
    /const\{isSmartTransaction:(\w+),featureFlags:(\w+)\}=\(0,(\w+)\.getSmartTransactionCommonParams\)\((\w+),(\w+)\.chainId\);return !1\?/g
  const batchTxHookReverse =
    'const{isSmartTransaction:$1,featureFlags:$2}=(0,$3.getSmartTransactionCommonParams)($4,$5.chainId);return $1?'

  const filePatchers: Array<{
    fileName: string
    description: string
    transform: (content: string) => string
    reverseTransform: (content: string) => string
  }> = [
    {
      fileName: 'common-0.js',
      description: 'STX opt-in + tx simulations defaults',
      transform: content =>
        content
          .replace(optInPattern, 'smartTransactionsOptInStatus:!1')
          .replace(txSimulationsPattern, 'useTransactionSimulations:!1'),
      reverseTransform: content =>
        content
          .replace(
            /smartTransactionsOptInStatus:!1/g,
            'smartTransactionsOptInStatus:!0',
          )
          .replace(
            /useTransactionSimulations:!1/g,
            'useTransactionSimulations:!0',
          ),
    },
    {
      fileName: 'common-13.js',
      description: 'STX opt-in nullish coalescing fallback',
      transform: content =>
        content
          .replace(optInPattern, 'smartTransactionsOptInStatus:!1')
          // Also patch the nullish coalescing fallback: ?.smartTransactionsOptInStatus)??!0 → ??!1
          .replace(
            /smartTransactionsOptInStatus\)\?\?![01]/g,
            'smartTransactionsOptInStatus)??!1',
          ),
      reverseTransform: content =>
        content
          .replace(
            /smartTransactionsOptInStatus:!1/g,
            'smartTransactionsOptInStatus:!0',
          )
          .replace(
            /smartTransactionsOptInStatus\)\?\?!1/g,
            'smartTransactionsOptInStatus)??!0',
          ),
    },
    {
      fileName: 'common-14.js',
      description: 'STX opt-in defaults',
      transform: content =>
        content.replace(optInPattern, 'smartTransactionsOptInStatus:!1'),
      reverseTransform: content =>
        content.replace(
          /smartTransactionsOptInStatus:!1/g,
          'smartTransactionsOptInStatus:!0',
        ),
    },
    // common-16.js only has a string key reference ("smartTransactionsOptInStatus"),
    // not a value to patch — skipped.
    {
      fileName: 'background-1.js',
      description: 'STX opt-in + tx simulations defaults',
      transform: content =>
        content
          .replace(optInPattern, 'smartTransactionsOptInStatus:!1')
          .replace(txSimulationsPattern, 'useTransactionSimulations:!1'),
      reverseTransform: content =>
        content
          .replace(
            /smartTransactionsOptInStatus:!1/g,
            'smartTransactionsOptInStatus:!0',
          )
          .replace(
            /useTransactionSimulations:!1/g,
            'useTransactionSimulations:!0',
          ),
    },
    {
      fileName: 'background-7.js',
      description: 'STX opt-in defaults',
      transform: content =>
        content.replace(optInPattern, 'smartTransactionsOptInStatus:!1'),
      reverseTransform: content =>
        content.replace(
          /smartTransactionsOptInStatus:!1/g,
          'smartTransactionsOptInStatus:!0',
        ),
    },
    // Hard-disable STX routing in BOTH publish hooks (single-tx + batch).
    // Onboarding can override preference defaults in storage, so these patches
    // guarantee the direct publish path for tx submission.
    {
      fileName: 'background-5.js',
      description: 'STX publish hooks (single-tx + batch)',
      transform: content =>
        content
          .replace(singleTxHookRegex, singleTxHookReplacement)
          .replace(batchTxHookRegex, batchTxHookReplacement),
      reverseTransform: content =>
        content
          .replace(singleTxHookPatchedRegex, singleTxHookReverse)
          .replace(batchTxHookPatchedRegex, batchTxHookReverse),
    },
  ]

  console.log('[anvil-fixture] Patching MetaMask extension for STX disable...')

  for (const {
    fileName,
    description,
    transform,
    reverseTransform,
  } of filePatchers) {
    const filePath = path.join(extensionPath, fileName)
    if (!fs.existsSync(filePath)) {
      console.log(
        `[anvil-fixture] ${fileName}: ${description} - FILE NOT FOUND (skipped)`,
      )
      continue
    }

    const content = fs.readFileSync(filePath, 'utf-8')

    // First, reverse any stale patches left from a previous un-restored run.
    // This recovers the "true original" so we can cleanly re-apply ALL patches.
    const trueOriginal = reverseTransform(content)
    const patched = transform(trueOriginal)

    if (patched !== content) {
      // Something changed — either fresh patches applied, or stale patches
      // were reversed and re-applied cleanly. Record the true original.
      stxPatchedFiles.push({ path: filePath, original: trueOriginal })
      fs.writeFileSync(filePath, patched)
      if (trueOriginal !== content) {
        console.log(
          `[anvil-fixture] ${fileName}: ${description} - RE-PATCHED (recovered stale patches + applied fresh)`,
        )
      } else {
        console.log(`[anvil-fixture] ${fileName}: ${description} - PATCHED`)
      }
    } else if (trueOriginal !== content) {
      // File is already fully patched — record the true original for restore.
      stxPatchedFiles.push({ path: filePath, original: trueOriginal })
      console.log(
        `[anvil-fixture] ${fileName}: ${description} - ALREADY PATCHED (recorded original for restore)`,
      )
    } else {
      console.log(
        `[anvil-fixture] ${fileName}: ${description} - NO MATCH (pattern not found)`,
      )
    }
  }

  console.log(
    `[anvil-fixture] STX patch complete: ${stxPatchedFiles.length} file(s) recorded for restore`,
  )
}

/** Restore all files patched by disableSmartTransactionsInFiles */
function restoreSmartTransactionsFiles(): void {
  for (const { path: filePath, original } of stxPatchedFiles) {
    fs.writeFileSync(filePath, original)
  }
  stxPatchedFiles.length = 0
}

export const test = walletTest.extend<{ anvilRpc: AnvilRpcHelper }>({
  // Override extensionContext to patch MetaMask's service worker before launch.
  // The parent fixture (metamask.fixture) launches the browser with MetaMask
  // loaded, but we need to modify the extension files BEFORE the browser reads
  // them. This requires duplicating the browser launch logic.
  extensionContext: async ({}, use) => {
    const env = loadEnvConfig()
    const extensionPath = env.METAMASK_EXTENSION_PATH

    if (!fs.existsSync(extensionPath)) {
      throw new Error(
        `MetaMask extension not found at ${extensionPath}. Run "pnpm setup:metamask" first.`,
      )
    }

    // ── Patch MetaMask's service worker before browser launch ──
    swFilePath = path.join(extensionPath, 'scripts', 'app-init.js')
    const currentContent = fs.readFileSync(swFilePath, 'utf-8')

    if (currentContent.includes(PATCH_MARKER)) {
      // Already patched (previous run didn't clean up) — strip old patch
      // Find the end of the IIFE: })();\n
      const patchEnd = currentContent.indexOf('})();\n')
      if (patchEnd !== -1) {
        originalSwContent = currentContent.slice(patchEnd + '})();\n'.length)
      } else {
        originalSwContent = currentContent
      }
    } else {
      originalSwContent = currentContent
    }

    if (env.ANVIL_MAINNET_RPC && env.ANVIL_LINEA_RPC) {
      const patch = buildServiceWorkerPatch(
        env.ANVIL_MAINNET_RPC,
        env.ANVIL_LINEA_RPC,
      )
      fs.writeFileSync(swFilePath, patch + originalSwContent)
    }

    // ── Disable Smart Transactions in MetaMask's compiled files ──
    // Must happen BEFORE browser launch so MetaMask reads the patched defaults.
    disableSmartTransactionsInFiles(extensionPath)

    // ── Launch browser (same as parent metamask.fixture) ──
    const profileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pw-metamask-'))

    const context = await chromium.launchPersistentContext(profileDir, {
      headless: false,
      args: [
        `--disable-extensions-except=${extensionPath}`,
        `--load-extension=${extensionPath}`,
        '--no-first-run',
        '--disable-default-apps',
      ],
      viewport: { width: VIEWPORT.WIDTH, height: VIEWPORT.HEIGHT },
    })

    await use(context)

    await context.close()
    fs.rmSync(profileDir, { recursive: true, force: true })

    // ── Restore patched extension files ──
    if (originalSwContent !== null && swFilePath) {
      fs.writeFileSync(swFilePath, originalSwContent)
    }
    restoreSmartTransactionsFiles()
  },

  anvilRpc: async ({}, use) => {
    const env = loadEnvConfig()

    if (!env.ANVIL_MAINNET_RPC || !env.ANVIL_LINEA_RPC) {
      throw new Error(
        'ANVIL_MAINNET_RPC and ANVIL_LINEA_RPC must be set for anvil-deposits tests. ' +
          'Run: ./scripts/setup-anvil.sh and configure e2e/.env',
      )
    }

    const walletAddress = env.WALLET_ADDRESS
    if (!walletAddress) {
      throw new Error(
        'WALLET_ADDRESS must be set for anvil-deposits tests. ' +
          'Derive it with: cast wallet address --mnemonic "$WALLET_SEED_PHRASE" --mnemonic-index 0',
      )
    }

    const helper = new AnvilRpcHelper(
      env.ANVIL_MAINNET_RPC,
      env.ANVIL_LINEA_RPC,
      walletAddress,
    )

    // First test in the run: verify Anvil is healthy and take base snapshots
    if (!baseSnapshots) {
      await helper.requireHealthy()
      baseSnapshots = await helper.snapshotBoth()
    } else {
      // Subsequent tests: revert to clean state.
      // If revert fails (snapshot consumed/invalid), re-establish base state
      // from the current (dirty) Anvil state to prevent cascading failures.
      try {
        await helper.revertBoth(baseSnapshots)
      } catch (err) {
        console.log(
          `[anvil-fixture] revertBoth failed: ${err instanceof Error ? err.message : err}. ` +
            `Re-establishing base state from current Anvil state.`,
        )
        // Re-fund ETH on both forks (same as setup-anvil.sh base_setup)
        await Promise.all([
          helper.setEthBalance(10n * 10n ** 18n),
          helper.setEthBalance(10n * 10n ** 18n, helper.lineaRpc),
        ])
      }
      // Re-snapshot immediately (revert consumes the snapshot)
      baseSnapshots = await helper.snapshotBoth()
    }

    // Force auto-mining on both forks before each test.
    // We observed intermittent cases where interval mining leaves the second
    // tx (approve -> deposit flow) pending with null receipt indefinitely.
    // Auto-mining keeps transaction confirmation deterministic for UI polling.
    await helper.enableAutoMining()
    await helper.enableAutoMining(helper.lineaRpc)

    await use(helper)
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hubPage: async ({ extensionContext, metamask, anvilRpc: _anvilRpc }, use) => {
    const env = loadEnvConfig()

    // ── Context-level route for Hub page requests ──────────────────────
    //
    // The Hub frontend makes RPC calls via its own HTTP transports (wagmi
    // public client → tRPC proxy or direct RPC endpoints). These are page-
    // level fetch() calls that context.route() CAN intercept.
    //
    // MetaMask's service worker requests are handled by Layer 1 (the file-
    // level fetch patch applied before browser launch).
    //
    // Chain discovery uses three strategies:
    //   1. Parse ?chainId= query param (tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
    //   2. Hostname-based lookup for known RPC providers (no network needed)
    //   3. Probe with eth_chainId as fallback (with one retry on failure)
    // Known RPC hostname → chainId mapping. Eliminates the need for
    // eth_chainId probes on well-known providers, preventing transient
    // network failures from permanently caching null (which would leak
    // requests to the real chain and cause flaky balance reads).
    const KNOWN_MAINNET_HOSTS = [
      'mainnet.infura.io',
      'eth.merkle.io',
      'ethereum-rpc.publicnode.com',
      'cloudflare-eth.com',
      'eth-mainnet.g.alchemy.com',
      'rpc.ankr.com',
      '1rpc.io',
    ]
    const KNOWN_LINEA_HOSTS = ['rpc.linea.build', 'linea-mainnet.infura.io']

    const getChainIdByHostname = (url: string): number | null => {
      try {
        const hostname = new URL(url).hostname
        // Check Linea FIRST — 'linea-mainnet.infura.io' contains 'mainnet.infura.io'
        // as a substring, so checking mainnet first would misclassify Linea URLs.
        if (KNOWN_LINEA_HOSTS.some(h => hostname.includes(h))) return 59144
        if (KNOWN_MAINNET_HOSTS.some(h => hostname.includes(h))) return 1
      } catch {
        // ignore URL parsing errors
      }
      return null
    }

    // Result is cached per URL for the lifetime of the context.
    const rpcRedirectCache = new Map<string, string | null>()
    const txReceiptMethodPattern = /"method"\s*:\s*"eth_getTransactionReceipt"/

    const hasNonNullRpcResult = (responseBody: string): boolean => {
      try {
        const parsed = JSON.parse(responseBody) as
          | { result?: unknown }
          | Array<{ result?: unknown }>
        if (Array.isArray(parsed)) {
          return parsed.some(
            item => item && item.result !== null && item.result !== undefined,
          )
        }
        return parsed.result !== null && parsed.result !== undefined
      } catch {
        return false
      }
    }

    const forwardRpcToAnvil = async (anvilUrl: string, body: string) => {
      const res = await fetch(anvilUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
      })
      return {
        status: res.status,
        body: await res.text(),
      }
    }

    await extensionContext.route('**/*', async route => {
      const request = route.request()
      if (request.method() !== 'POST') return route.continue()

      const postData = request.postData()
      if (!postData?.includes('"jsonrpc"')) return route.continue()
      // Keep Linea-specific RPC methods on upstream providers to preserve
      // provider-specific response format used for fee calculation.
      if (postData.includes('"method":"linea_')) return route.continue()

      const url = request.url()
      // Never intercept extension-internal or localhost requests
      if (url.startsWith('chrome-extension:') || url.includes('localhost')) {
        return route.continue()
      }

      // Lazy-discover which chain this endpoint serves
      if (!rpcRedirectCache.has(url)) {
        // Strategy 1: extract chainId from URL query parameter
        // (e.g. tRPC proxy: /api/trpc/rpc.proxy?chainId=1)
        const chainIdParam = new URL(url).searchParams.get('chainId')
        if (chainIdParam) {
          const chainId = Number(chainIdParam)
          if (chainId === 1) rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC)
          else if (chainId === 59144)
            rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC)
          else rpcRedirectCache.set(url, null)
        } else {
          // Strategy 2: hostname-based lookup (no network needed)
          const knownChainId = getChainIdByHostname(url)
          if (knownChainId !== null) {
            if (knownChainId === 1)
              rpcRedirectCache.set(url, env.ANVIL_MAINNET_RPC)
            else if (knownChainId === 59144)
              rpcRedirectCache.set(url, env.ANVIL_LINEA_RPC)
            else rpcRedirectCache.set(url, null)
          } else {
            // Strategy 3: probe with eth_chainId (retry once on failure)
            let probeResult: string | null = null
            for (let attempt = 0; attempt < 2; attempt++) {
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
                })
                const json = (await probe.json()) as { result: string }
                const chainId = parseInt(json.result, 16)
                if (chainId === 1) probeResult = env.ANVIL_MAINNET_RPC
                else if (chainId === 59144) probeResult = env.ANVIL_LINEA_RPC
                break
              } catch (err) {
                if (attempt === 0) {
                  console.warn(
                    `[anvil-intercept] Probe attempt 1 failed for ${url}, retrying...`,
                  )
                  await new Promise(r => setTimeout(r, 500))
                } else {
                  console.warn(
                    `[anvil-intercept] Probe failed permanently for ${url}: ${err}`,
                  )
                }
              }
            }
            rpcRedirectCache.set(url, probeResult)
          }
        }
      }

      const anvilUrl = rpcRedirectCache.get(url)
      if (!anvilUrl) return route.continue()

      // eth_getTransactionReceipt requests can be misrouted after network
      // switches. If the primary fork returns null, fall back to the other
      // fork before returning the response.
      const isTxReceiptRequest = txReceiptMethodPattern.test(postData)
      const fallbackAnvilUrl =
        anvilUrl === env.ANVIL_LINEA_RPC
          ? env.ANVIL_MAINNET_RPC
          : env.ANVIL_LINEA_RPC

      try {
        const primary = await forwardRpcToAnvil(anvilUrl, postData)

        if (!isTxReceiptRequest) {
          return route.fulfill({
            status: primary.status,
            contentType: 'application/json',
            body: primary.body,
          })
        }

        if (primary.status === 200 && hasNonNullRpcResult(primary.body)) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: primary.body,
          })
        }

        const fallback = await forwardRpcToAnvil(fallbackAnvilUrl, postData)
        if (fallback.status === 200 && hasNonNullRpcResult(fallback.body)) {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: fallback.body,
          })
        }

        // Preserve original semantics when both forks return null/pending.
        return route.fulfill({
          status: primary.status,
          contentType: 'application/json',
          body: primary.body,
        })
      } catch {
        // Anvil unreachable — abort so the test fails loudly instead of
        // silently falling through to the real RPC (where balances are 0).
        return route.abort('connectionrefused')
      }
    })

    const page = await extensionContext.newPage()

    await page.goto(env.BASE_URL)
    await page.waitForLoadState('domcontentloaded')

    // Block wallet_addEthereumChain requests BEFORE connecting to MetaMask.
    // The Hub sends these immediately after connection (for Status Network Sepolia).
    // These queue up as "Add Network" popups in MetaMask and interfere with
    // transaction approvals — MetaMask shows them ahead of actual txs, and
    // handling them (cancel/navigate) can cause port disconnects that auto-reject
    // pending transactions. Blocking at the provider level prevents them from
    // ever reaching MetaMask.
    await page.evaluate(() => {
      const provider = (window as unknown as Record<string, unknown>)
        .ethereum as {
        request: (args: {
          method: string
          params?: unknown[]
        }) => Promise<unknown>
      }
      if (!provider) return
      const originalRequest = provider.request.bind(provider)
      provider.request = async (args: {
        method: string
        params?: unknown[]
      }) => {
        if (args.method === 'wallet_addEthereumChain') {
          console.warn(
            '[anvil-fixture] Blocked wallet_addEthereumChain request',
          )
          // Resolve silently — MetaMask spec says null = already added
          return null
        }
        return originalRequest(args)
      }
    })

    await metamask.connectToDApp(page)

    // The Hub may still have queued wallet_addEthereumChain before the provider
    // patch took effect (race during DOMContentLoaded). Dismiss any stragglers.
    await metamask.dismissPendingAddNetwork()

    await use(page)

    // Clean up context-level route when test finishes
    await extensionContext.unrouteAll({ behavior: 'ignoreErrors' })
  },
})
