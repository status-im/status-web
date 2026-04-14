import { getDefaultConfig } from 'connectkit'
import { defineChain, parseGwei } from 'viem'
import { linea as lineaChainConfig } from 'viem/chains'
import { estimateGas } from 'viem/linea'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet } from 'wagmi/chains'

import { PuzzleAuthService, RETRY_STATUS_CODES } from '~services/puzzle-auth'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'

const FALLBACK_MAX_FEE_PER_GAS = parseGwei('100')
const FALLBACK_MAX_PRIORITY_FEE_PER_GAS = parseGwei('100')

export const statusHoodi = defineChain({
  // https://github.com/wevm/viem/blob/main/src/chains/definitions/statusNetworkSepolia.ts
  ...lineaChainConfig,
  id: 374,
  name: 'Status Network Hoodi',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://public.hoodi.rpc.status.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://hoodiscan.status.network',
    },
  },
  contracts: {},
  testnet: true,
  fees: {
    async estimateFeesPerGas({ client, request }) {
      const account = request?.account
      if (!account) {
        return {
          maxFeePerGas: FALLBACK_MAX_FEE_PER_GAS,
          maxPriorityFeePerGas: FALLBACK_MAX_PRIORITY_FEE_PER_GAS,
        }
      }
      try {
        const response = await estimateGas(client, {
          ...request,
          account,
        })
        const maxPriorityFeePerGas = response.priorityFeePerGas
        const baseFeePerGas = response.baseFeePerGas
        return {
          maxFeePerGas: baseFeePerGas + maxPriorityFeePerGas,
          maxPriorityFeePerGas,
        }
      } catch {
        return {
          maxFeePerGas: FALLBACK_MAX_FEE_PER_GAS,
          maxPriorityFeePerGas: FALLBACK_MAX_PRIORITY_FEE_PER_GAS,
        }
      }
    },
  },
})

const tRpcProxyUrl = (chainId: number) =>
  `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${chainId}`

const rpcProxyPaths: Record<number, string> = {
  [mainnet.id]: '/ethereum/mainnet',
  [linea.id]: '/linea/mainnet',
  [statusHoodi.id]: '/status/hoodi',
}

const rpcProxyUrl = (chainId: number) => {
  const base = clientEnv.NEXT_PUBLIC_RPC_PROXY_URL?.replace(/\/+$/, '') ?? ''
  return `${base}${rpcProxyPaths[chainId]}`
}

const createPuzzleAuthHooks = () => {
  const origin = new URL(clientEnv.NEXT_PUBLIC_RPC_PROXY_URL!).origin
  const service = PuzzleAuthService.forOrigin(origin)

  return {
    onFetchRequest: async (
      _request: Request,
      init: RequestInit
    ): Promise<RequestInit | undefined> => {
      const token = service.getToken() ?? (await service.ensureToken())
      if (!token) return undefined

      const headers = new Headers(init.headers)
      headers.set('Authorization', `Bearer ${token}`)
      return { ...init, headers }
    },
    onFetchResponse: async (response: Response): Promise<void> => {
      if (RETRY_STATUS_CODES.has(response.status)) {
        service.invalidateToken()
      }
    },
  }
}

const isPuzzleAuthEnabled = Boolean(
  clientEnv.NEXT_PUBLIC_USE_PUZZLE_AUTH && clientEnv.NEXT_PUBLIC_RPC_PROXY_URL
)

const puzzleAuthHooks = isPuzzleAuthEnabled ? createPuzzleAuthHooks() : {}

const createTransport = (chainId: number) =>
  http(isPuzzleAuthEnabled ? rpcProxyUrl(chainId) : tRpcProxyUrl(chainId), {
    ...puzzleAuthHooks,
  })

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [statusHoodi, mainnet, linea],
    transports: {
      [statusHoodi.id]: createTransport(statusHoodi.id),
      [mainnet.id]: createTransport(mainnet.id),
      [linea.id]: createTransport(linea.id),
    },
    walletConnectProjectId:
      clientEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    appName: 'Status Hub',
    appDescription: 'Status Network',
    appUrl: 'https://hub.status.network',
    appIcon: '/logo.svg',
    enableFamily: false,
  }) as CreateConfigParameters<
    readonly [Chain, ...Chain[]],
    Record<number, Transport>,
    readonly CreateConnectorFn[]
  >

export const wagmiConfig = createConfig(getDefaultWagmiConfig())
