import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet, statusSepolia } from 'wagmi/chains'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'

const rpcProxy = (chainId: number) =>
  `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${chainId}`

export const RPC_URLS = {
  [mainnet.id]: rpcProxy(mainnet.id),
  [linea.id]: rpcProxy(linea.id),
  [statusSepolia.id]: rpcProxy(statusSepolia.id),
} as const

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [statusSepolia, mainnet, linea],
    transports: {
      [statusSepolia.id]: http(RPC_URLS[statusSepolia.id]),
      [mainnet.id]: http(RPC_URLS[mainnet.id]),
      [linea.id]: http(RPC_URLS[linea.id]),
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
