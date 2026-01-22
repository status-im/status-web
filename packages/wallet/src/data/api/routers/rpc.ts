import { z } from 'zod'

import { serverEnv } from '../../../config/env.server.mjs'
import { publicProcedure, router } from '../lib/trpc'

const PROXY_BASE_URL = serverEnv.ETH_RPC_PROXY_URL

const PROXY_AUTH = {
  username: serverEnv.ETH_RPC_PROXY_AUTH_USERNAME,
  password: serverEnv.ETH_RPC_PROXY_AUTH_PASSWORD,
}

const CHAIN_ID_TO_PROXY_PATH: Record<number, string> = {
  1: 'ethereum/mainnet',
  59144: 'linea/mainnet',
  11155111: 'ethereum/sepolia',
}

export const rpcRouter = router({
  proxy: publicProcedure
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

    throw new Error(`Failed to fetch: ${response.status} ${errorMessage}`)
  }

  return response.json() as Promise<T>
}
