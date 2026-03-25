import { getDefaultConfig } from 'connectkit'
import { defineChain, parseGwei } from 'viem'
import { linea as lineaChainConfig } from 'viem/chains'
import { estimateGas } from 'viem/linea'
import { createConfig, http } from 'wagmi'
import { type Chain, linea, mainnet } from 'wagmi/chains'

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
      http: ['https://rpc.status-network-testnet-hoodi.gateway.fm'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Blockscout',
      url: 'https://explorer.status-network-testnet-hoodi.gateway.fm',
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

export const getDefaultWagmiConfig = () =>
  getDefaultConfig({
    chains: [statusHoodi, mainnet, linea],
    transports: {
      // TODO: switch back to proxy once Andrey adds status/hoodi route
      [statusHoodi.id]: http(
        'https://rpc.status-network-testnet-hoodi.gateway.fm'
      ),
      // TODO: switch back to proxy once rpc proxy is available in dev
      [mainnet.id]: http(),
      [linea.id]: http(),
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
