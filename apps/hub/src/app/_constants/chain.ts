import { getDefaultConfig } from 'connectkit'
import { defineChain } from 'viem'
import { linea as lineaChainConfig } from 'viem/chains'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet } from 'wagmi/chains'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'

export const statusHoodi = defineChain({
  // https://github.com/wevm/viem/blob/main/src/chains/definitions/statusNetworkSepolia.ts
  ...lineaChainConfig,
  id: 374,
  name: 'Status Network Hoodi',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: '',
    },
  },
  testnet: true,
})

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [statusHoodi, mainnet, linea],
    transports: {
      [statusHoodi.id]: http(
        `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${statusHoodi.id}`
      ),
      [mainnet.id]: http(
        `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${mainnet.id}`
      ),
      [linea.id]: http(
        `${clientEnv.NEXT_PUBLIC_STATUS_API_URL}/api/trpc/rpc.proxy?chainId=${linea.id}`
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
