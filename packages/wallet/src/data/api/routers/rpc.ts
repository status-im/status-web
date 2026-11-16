import { z } from 'zod'

import { serverEnv } from '../../../config/env.server.mjs'
import {
  parseRetryAfterSeconds,
  RateLimitError,
} from '../../../utils/error-cause'
import { ethRPCProcedure, router } from '../lib/trpc'

const PROXY_BASE_URL = serverEnv.ETH_RPC_PROXY_URL

const PROXY_AUTH = {
  username: serverEnv.ETH_RPC_PROXY_AUTH_USERNAME,
  password: serverEnv.ETH_RPC_PROXY_AUTH_PASSWORD,
}

/**
 * The upstream half of the wallet extension's chain registry
 * (`apps/wallet/src/lib/chains.ts`): a chain is only readable once it has an
 * entry here and a matching `proxyChainId` there.
 *
 * Chain 1 takes the `/alchemy` path `nodes.broadcastTransaction` uses: a node
 * that does not hold the transaction answers receipt lookups with null forever.
 */
const CHAIN_ID_TO_PROXY_PATH: Record<number, string> = {
  1: 'ethereum/mainnet/alchemy',
  59144: 'linea/mainnet',
  11155111: 'ethereum/sepolia',
  374: 'status/hoodi',
}

/**
 * Methods the relay forwards upstream; anything else gets a JSON-RPC
 * "method not found" error without reaching the node, so the public relay
 * cannot reach debug_*, trace_*, admin_*, txpool_*, personal_* or eth_sign*.
 *
 * Built from what the callers send: the extension's dApp forwarding table
 * (`REMOTE_ALLOWED` in `apps/wallet/src/lib/rpc-methods.ts`, mirroring
 * status-go's connector), plus `eth_chainId` and `net_version`, which viem
 * and wagmi transports (extension, hub) ask the node for directly. Keep the
 * two lists in step when the extension starts forwarding a new method.
 */
export const RPC_RELAY_ALLOWED_METHODS: ReadonlySet<string> = new Set([
  'eth_chainId',
  'net_version',
  'net_peerCount',
  'net_listening',
  'eth_protocolVersion',
  'eth_syncing',
  'eth_coinbase',
  'eth_mining',
  'eth_hashrate',
  'eth_gasPrice',
  'eth_maxPriorityFeePerGas',
  'eth_feeHistory',
  'eth_blockNumber',
  'eth_getBalance',
  'eth_getStorageAt',
  'eth_getTransactionCount',
  'eth_getBlockTransactionCountByHash',
  'eth_getBlockTransactionCountByNumber',
  'eth_getUncleCountByBlockHash',
  'eth_getUncleCountByBlockNumber',
  'eth_getCode',
  'eth_sendRawTransaction',
  'eth_call',
  'eth_estimateGas',
  'linea_estimateGas',
  'eth_getBlockByHash',
  'eth_getBlockByNumber',
  'eth_getTransactionByHash',
  'eth_getTransactionByBlockHashAndIndex',
  'eth_getTransactionByBlockNumberAndIndex',
  'eth_getTransactionReceipt',
  'eth_getUncleByBlockHashAndIndex',
  'eth_getUncleByBlockNumberAndIndex',
  'eth_getLogs',
  'eth_getWork',
  'eth_submitWork',
  'eth_submitHashrate',
])

export const rpcRouter = router({
  proxy: ethRPCProcedure
    .input(
      z.object({
        method: z.string(),
        params: z.array(z.unknown()).optional(),
        id: z.union([z.string(), z.number()]).optional(),
        jsonrpc: z.literal('2.0').optional(),
        chainId: z.number().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (!RPC_RELAY_ALLOWED_METHODS.has(input.method)) {
        return {
          jsonrpc: '2.0',
          id: input.id ?? 1,
          error: {
            code: -32601,
            message: `Method not supported: ${input.method}`,
          },
        }
      }

      const chainId = input.chainId ?? 1
      const proxyPath = CHAIN_ID_TO_PROXY_PATH[chainId]

      if (!proxyPath) {
        throw new Error(`Unsupported chainId: ${chainId}`)
      }

      const url = new URL(`${PROXY_BASE_URL}/${proxyPath}`)

      const jsonRpcRequest = {
        jsonrpc: '2.0',
        method: input.method,
        params: input.params || [],
        id: input.id ?? 1,
      }

      return await _fetchWithAuth<{
        jsonrpc: string
        id: string | number
        result?: unknown
        error?: { code: number; message: string; data?: unknown }
      }>(url, jsonRpcRequest)
    }),
})

async function _fetchWithAuth<T>(url: URL, body: unknown): Promise<T> {
  const credentials = Buffer.from(
    `${PROXY_AUTH.username}:${PROXY_AUTH.password}`,
  ).toString('base64')

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    cache: 'no-store',
  })

  if (!response.ok) {
    let errorMessage = response.statusText
    try {
      const errorBody = await response.text()
      if (errorBody) {
        try {
          const parsed = JSON.parse(errorBody)
          errorMessage = parsed.error?.message || parsed.message || errorBody
        } catch {
          errorMessage = errorBody
        }
      }
    } catch {
      // Ignore errors when reading error body
    }

    const message = `Failed to fetch: ${response.status} ${errorMessage}`
    if (response.status === 429) {
      throw new RateLimitError(
        message,
        parseRetryAfterSeconds(response.headers.get('retry-after')),
      )
    }
    throw new Error(message, { cause: response.status })
  }

  return response.json() as Promise<T>
}
