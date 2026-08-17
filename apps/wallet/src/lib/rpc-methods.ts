/**
 * Which RPC methods a dApp may call, mirroring status-go's `services/connector`
 * so the extension, desktop and mobile expose the same surface.
 *
 * Tables only, no handler imports -- tests assert against them directly.
 */

/**
 * Methods forwarded to the node, transcribed from status-go @384a179
 * `services/connector/remote.go`. Upstream's commented-out entries are kept
 * verbatim, with their reasons, so the next sync against status-go is a
 * readable diff rather than a re-derivation.
 */
export const REMOTE_ALLOWED = new Set([
  'eth_protocolVersion',
  'eth_syncing',
  'eth_coinbase',
  'eth_mining',
  'eth_hashrate',
  'eth_gasPrice',
  'eth_maxPriorityFeePerGas',
  'eth_feeHistory',
  // 'eth_accounts', // due to sub-accounts handling
  'eth_blockNumber',
  'eth_getBalance',
  'eth_getStorageAt',
  'eth_getTransactionCount',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_getCode',
  // 'eth_sign', // only the local node has an injected account to sign the payload with
  // 'eth_sendTransaction', // handled locally: estimate, sign, then eth_sendRawTransaction
  'eth_sendRawTransaction',
  'eth_call',
  'eth_estimateGas',
  'linea_estimateGas', // Status chain specific gas estimation
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getTransactionByHash',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  // 'eth_getCompilers', 'eth_compileLLL', 'eth_compileSolidity', 'eth_compileSerpent'
  //   -- local-only upstream, nothing to forward
  'eth_getLogs',
  'eth_getWork',
  'eth_submitWork',
  'eth_submitHashrate',
  // 'net_version', // must be answerable before connection, so it is local
  'net_peerCount',
  'net_listening',
])

/**
 * Local methods the dispatcher does not gate, either because they are
 * reachable before connection or because they enforce a more specific check
 * themselves. status-go gates no registry command in `CallRPC` either -- each
 * command validates internally.
 *
 * `eth_requestAccounts` is how an origin becomes permitted in the first place.
 * `wallet_revokePermissions` is ungated because revoking is always safe and
 * EIP-2255 does not require a connection to revoke. `wallet_requestPermissions`
 * does check, but reports status-go's distinct `ErrDAppNotFound` rather than
 * the generic refusal. The rest are discovery calls that expose nothing about
 * the wallet.
 */
export const UNGATED_LOCAL = new Set([
  'eth_chainId',
  'net_version',
  'eth_accounts',
  'eth_requestAccounts',
  'wallet_getPermissions',
  'wallet_requestPermissions',
  'wallet_revokePermissions',
  'wallet_getCapabilities',
])
