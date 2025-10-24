import { getDefaultConfig } from 'connectkit'
import { defineChain } from 'viem'
import { createConfig, http } from 'wagmi'

import { clientEnv } from './env.client.mjs'

import type {
  CreateConfigParameters,
  CreateConnectorFn,
  Transport,
} from 'wagmi'
import type { Chain } from 'wagmi/chains'

export const testnet = defineChain({
  id: 1660990954,
  name: 'Status Network Testnet',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: ['https://public.sepolia.rpc.status.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Status Explorer',
      url: 'https://sepoliascan.status.network',
    },
  },
})

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [testnet],
    transports: {
      [testnet.id]: http(testnet.rpcUrls.default.http[0]),
    },
    walletConnectProjectId:
      clientEnv.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
    appName: 'Status Hub',
    appDescription: 'Status Network DeFi Dashboard',
    appUrl: 'https://status.app',
    appIcon: 'https://status.app/icon.png',
  }) as CreateConfigParameters<
    readonly [Chain, ...Chain[]],
    Record<number, Transport>,
    readonly CreateConnectorFn[]
  >

export const wagmiConfig = createConfig(getDefaultWagmiConfig())
