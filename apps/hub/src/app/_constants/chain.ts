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
        clientEnv.NEXT_PUBLIC_MAINNET_RPC_URL ||
          (clientEnv.NEXT_PUBLIC_STATUS_API_URL
            ? `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${mainnet.id}`
            : mainnet.rpcUrls.default.http[0])
      ),
      [linea.id]: http(
        clientEnv.NEXT_PUBLIC_LINEA_RPC_URL ||
          (clientEnv.NEXT_PUBLIC_STATUS_API_URL
            ? `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${linea.id}`
            : linea.rpcUrls.default.http[0])
      ),
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
