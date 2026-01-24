import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet, statusSepolia } from 'wagmi/chains'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [statusSepolia, mainnet, linea],
    transports: {
      [statusSepolia.id]: http(statusSepolia.rpcUrls.default.http[0]),
      [mainnet.id]: http(
        'https://mainnet.infura.io/v3/6291a6aa45c94fd79bda6770b58153dd'
      ),
      [linea.id]: http(linea.rpcUrls.default.http[0]),
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
