/**
 * Known RPC provider hostnames for chain detection.
 *
 * Used in both:
 * - Service worker fetch patch (Layer 1 — MetaMask internal RPC)
 * - Context-level route (Layer 2 — Hub page RPC)
 *
 * Keeping a single source of truth prevents host list divergence
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
