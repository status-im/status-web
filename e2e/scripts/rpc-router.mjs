#!/usr/bin/env node
/**
 * rpc-router — path-forwarding JSON-RPC proxy for wallet-extension E2E tests.
 *
 * The Status wallet talks to the status-api backend (apps/api), which forwards
 * chain calls to `${ETH_RPC_PROXY_URL}/<chain>/<network>[/alchemy]`:
 *   - rpc.proxy  -> `${ETH_RPC_PROXY_URL}/ethereum/mainnet`
 *   - nodes.*    -> `${ETH_RPC_PROXY_URL}/ethereum/mainnet/alchemy`  (broadcast/nonce/fee)
 *
 * Anvil only answers JSON-RPC at `/` (verified: it 404s on `/ethereum/mainnet`),
 * so we point ETH_RPC_PROXY_URL at this router and it strips the path prefix,
 * ignores basic auth, and forwards the raw body to the correct Anvil fork by the
 * leading path segment.
 *
 * Env:
 *   RPC_ROUTER_PORT       (default 8548)
 *   ANVIL_MAINNET_RPC     (default http://localhost:8547)
 *   ANVIL_LINEA_RPC       (default http://localhost:8546)
 */
import http from 'node:http'

const PORT = Number(process.env.RPC_ROUTER_PORT ?? 8548)
const MAINNET = process.env.ANVIL_MAINNET_RPC ?? 'http://localhost:8547'
const LINEA = process.env.ANVIL_LINEA_RPC ?? 'http://localhost:8546'

/** Map the request path's leading segment to an Anvil fork URL. */
function resolveUpstream(pathname) {
  const seg = pathname.split('/').filter(Boolean)[0]?.toLowerCase()
  if (seg === 'ethereum') return MAINNET
  if (seg === 'linea') return LINEA
  return null
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    // Health probe / anything non-RPC.
    res.writeHead(req.method === 'GET' ? 200 : 405, {
      'content-type': 'text/plain',
    })
    res.end(req.method === 'GET' ? 'rpc-router ok' : 'method not allowed')
    return
  }

  const upstream = resolveUpstream(new URL(req.url, 'http://x').pathname)
  console.log(`[rpc-router] POST ${req.url} -> ${upstream ?? 'NO_FORK'}`)
  if (!upstream) {
    res.writeHead(404, { 'content-type': 'application/json' })
    res.end(JSON.stringify({ error: `no fork for path ${req.url}` }))
    return
  }

  const chunks = []
  req.on('data', c => chunks.push(c))
  req.on('end', async () => {
    const body = Buffer.concat(chunks)
    try {
      const upstreamRes = await fetch(upstream, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body,
      })
      const text = await upstreamRes.text()
      res.writeHead(upstreamRes.status, { 'content-type': 'application/json' })
      res.end(text)
    } catch (err) {
      res.writeHead(502, { 'content-type': 'application/json' })
      res.end(JSON.stringify({ error: `upstream fetch failed: ${err}` }))
    }
  })
})

server.listen(PORT, () => {
  console.log(
    `[rpc-router] listening on :${PORT} -> ethereum=${MAINNET} linea=${LINEA}`,
  )
})
