import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet, statusSepolia } from 'wagmi/chains'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'

export const RPC_URLS = {
  [mainnet.id]: 'https://mainnet.infura.io/v3/6291a6aa45c94fd79bda6770b58153dd',
  [linea.id]: linea.rpcUrls.default.http[0],
  [statusSepolia.id]: statusSepolia.rpcUrls.default.http[0],
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
