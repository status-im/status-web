import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet, statusSepolia } from 'wagmi/chains'

import { PuzzleAuthService, RETRY_STATUS_CODES } from '~services/puzzle-auth'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'

const tRpcProxyUrl = (chainId: number) =>
  `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${chainId}`

const rpcProxyUrl = (chainId: number) =>
  `${clientEnv.NEXT_PUBLIC_RPC_PROXY_URL}?chainId=${chainId}`

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

const isPuzzleAuthEnabled =
  clientEnv.NEXT_PUBLIC_USE_PUZZLE_AUTH && clientEnv.NEXT_PUBLIC_RPC_PROXY_URL

const puzzleAuthHooks = isPuzzleAuthEnabled ? createPuzzleAuthHooks() : {}

const createTransport = (chainId: number) =>
  http(isPuzzleAuthEnabled ? rpcProxyUrl(chainId) : tRpcProxyUrl(chainId), {
    ...puzzleAuthHooks,
  })

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [statusSepolia, mainnet, linea],
    transports: {
      [statusSepolia.id]: createTransport(statusSepolia.id),
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
