/**
 * Known RPC provider hostnames and URL paths for chain detection.
 *
 * Used in both:
 * - Service worker fetch patch (Layer 1 — MetaMask internal RPC)
 * - Context-level route (Layer 2 — Hub page RPC)
 *
 * Keeping a single source of truth prevents list divergence
 * that would leak requests to real chains during Anvil tests.
 */
export const KNOWN_MAINNET_HOSTS = [
  'mainnet.infura.io',
  'eth.merkle.io',
  'ethereum-rpc.publicnode.com',
  'cloudflare-eth.com',
  'eth-mainnet.g.alchemy.com',
  'rpc.ankr.com',
  '1rpc.io',
] as const

export const KNOWN_LINEA_HOSTS = [
  'rpc.linea.build',
  'linea-mainnet.infura.io',
  'linea.drpc.org',
  'linea-mainnet.quiknode.pro',
] as const

/**
 * Path fragments used by Hub's puzzle-authed RPC proxy (e.g. snt.eth-rpc.status.im).
 * One host serves multiple chains, so hostname matching alone is insufficient —
 * the path discriminates the chain. Mirrors `rpcProxyPaths` in
 * apps/hub/src/app/_constants/chain.ts.
 *
 * `/status/hoodi` is intentionally omitted — hoodi has no Anvil fork, requests
 * to it must pass through to the real RPC.
 */
export const KNOWN_MAINNET_PATHS = ['/ethereum/mainnet'] as const

export const KNOWN_LINEA_PATHS = ['/linea/mainnet'] as const
