import { KNOWN_LINEA_HOSTS, KNOWN_MAINNET_HOSTS } from '@constants/rpc-hosts.js'

export const PATCH_MARKER = '/* __ANVIL_RPC_PATCH__ */'

/**
 * Generate JS patch for MetaMask's service worker (prepended to app-init.js).
 * Wraps globalThis.fetch to redirect RPC to Anvil. Runs BEFORE LavaMoat lockdown —
 * must not reference any scuttled globals (URL, Intl, etc.), only primitives + fetch.
 */
export function buildServiceWorkerPatch(
  mainnetRpc: string,
  lineaRpc: string,
): string {
  return `${PATCH_MARKER}
(function() {
  var _f = globalThis.fetch;
  var _R = globalThis.Response;
  var _c = {};
  var _m = { '1': '${mainnetRpc}', '59144': '${lineaRpc}' };
  var _tx = {};
  var _stxCounter = 0;
  var _stxHashes = {};

  // Mock linea_estimateGas — returning instantly prevents MetaMask from
  // re-rendering the confirmation page mid-click (async response race).
  function _mockLineaEstimateGas(body) {
    var idMatch = body.match(/"id"\\s*:\\s*(\\d+)/);
    var id = idMatch ? idMatch[1] : '1';
    return Promise.resolve(new _R(
      '{"jsonrpc":"2.0","id":' + id + ',"result":{"baseFeePerGas":"0x174876E800","priorityFeePerGas":"0x3b9aca00","gasLimit":"0x7A120"}}',
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    ));
  }

  // Hostname-based chain detection (from constants/rpc-hosts.ts).
  var _mainnetHosts = [${KNOWN_MAINNET_HOSTS.map(h => `'${h}'`).join(',')}];
  var _lineaHosts = [${KNOWN_LINEA_HOSTS.map(h => `'${h}'`).join(',')}];
  function _chainByHost(u) {
    // Linea first: 'linea-mainnet.infura.io' contains 'mainnet.infura.io'
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

  // Forward to Anvil. After sendRawTransaction, fire-and-forget evm_mine
  // (must NOT await — blocking the fetch response causes MetaMask timeouts).
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
        try {
          var parsed = JSON.parse(text);
          if (Array.isArray(parsed)) {
            for (var i = 0; i < parsed.length; i++) {
              if (parsed[i] && parsed[i].result !== null && parsed[i].result !== undefined) return true;
            }
            return false;
          }
          return parsed.result !== null && parsed.result !== undefined;
        } catch (_) { return false; }
      }).catch(function() {
        return false;
      });
    } catch (_) {
      return Promise.resolve(false);
    }
  }

  // Receipt may be on either fork after network switch — try both.
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
    // Intercept STX relay API — redirect tx submissions to Anvil instead of
    // blocking (blocking causes MetaMask to mark txs as failed without fallback).
    var _url = (typeof input === 'string') ? input
             : (input && input.url) ? input.url : '' + input;
    if (_url.indexOf('transaction.api') !== -1
        || _url.indexOf('smart-transactions') !== -1
        || _url.indexOf('tx-sentinel') !== -1) {
      // A. submitTransactions — forward raw txs to Anvil, return fake uuid
      try {
        var _stxBody = (init && init.body && typeof init.body === 'string') ? init.body : '';
        if (_stxBody && (_stxBody.indexOf('rawTxs') !== -1 || _stxBody.indexOf('transactions') !== -1)) {
          var _cidMatch = _url.match(/\\/networks\\/(\\d+)\\//);
          var _cidQueryMatch = _url.match(/[?&]chainId=(\\d+)/);
          var _stxChainId = _cidMatch ? _cidMatch[1] : (_cidQueryMatch ? _cidQueryMatch[1] : _chainByHost(_url));
          var _stxTargets = [];
          if (_stxChainId && _m[_stxChainId]) {
            _stxTargets.push(_m[_stxChainId]);
          } else {
            if (_m['1']) _stxTargets.push(_m['1']);
            if (_m['59144'] && _m['59144'] !== _m['1']) _stxTargets.push(_m['59144']);
          }
          // Handles { rawTxs: ["0x..."] } and { transactions: [{ rawTx: "0x..." }] }
          var _rawTxList = [];
          try {
            var _parsed = JSON.parse(_stxBody);
            if (Array.isArray(_parsed.rawTxs) && _parsed.rawTxs.length) {
              _rawTxList = _parsed.rawTxs;
            } else if (Array.isArray(_parsed.transactions) && _parsed.transactions.length) {
              for (var _pi = 0; _pi < _parsed.transactions.length; _pi++) {
                if (_parsed.transactions[_pi].rawTx) _rawTxList.push(_parsed.transactions[_pi].rawTx);
              }
            }
          } catch (_parseErr) {
            console.warn('[anvil-stx] Failed to parse STX body: ' + _parseErr);
          }
          if (_rawTxList.length === 0) {
            console.warn('[anvil-stx] No raw txs extracted from STX body');
          }
          console.log('[anvil-stx] submitTx chainId=' + _stxChainId + ' txCount=' + _rawTxList.length);
          var _fakeUuid = 'anvil-stx-' + Date.now() + '-' + (++_stxCounter);
          if (_rawTxList.length && _stxTargets.length) {
            // Wait for Anvil response so hash is ready for batchStatus poll
            var _fwdPromises = [];
            for (var _ri = 0; _ri < _rawTxList.length; _ri++) {
              for (var _ti = 0; _ti < _stxTargets.length; _ti++) {
                _fwdPromises.push(
                  _fwd(_stxTargets[_ti], {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: '{"jsonrpc":"2.0","method":"eth_sendRawTransaction","params":["' + _rawTxList[_ri] + '"],"id":99997}'
                  }).then(function(res) {
                    return res.clone().text().then(function(text) {
                      var hm = text.match(/"result"\\s*:\\s*"(0x[a-fA-F0-9]{64})"/);
                      return hm ? hm[1] : null;
                    });
                  }).catch(function() { return null; })
                );
              }
            }
            // Store the first valid tx hash for batchStatus lookups
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
          // No raw txs found
          return Promise.resolve(new _R('{"uuid":"' + _fakeUuid + '"}', {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
          }));
        }
      } catch (_stxErr) {}

      // B. batchStatus — return fake status keyed by UUID
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
              console.log('[anvil-stx] batchStatus uuid=' + _uid + ' hasHash=' + !!_hash);
              if (_hash) {
                _statusJson += '"' + _uid + '":{"minedTx":"success","minedHash":"' + _hash + '","cancellationReason":"not_cancelled"}';
              } else {
                // Not ready — MetaMask will retry
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

      // C. All other STX API calls — empty success
      return Promise.resolve(new _R('{}', {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }));
    }

    // Handle fetch(Request) — decompose into (url, init) form
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

    // linea_estimateGas → mock; other linea_* → passthrough (needed for fee calc)
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

    // Hostname-based lookup
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
        var target = _m[cid] || null;
        _c[url] = target;
        return target;
      })
      .catch(function() {
        // Don't cache null — permanent null leaks requests to real chain
        delete _c[url];
        return null;
      });

    _c[url] = probe;
    return probe.then(function(u) {
      return u ? _fwd(u, init) : _f(url, init);
    });
  };
})();
`
}
