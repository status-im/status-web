import { getDefaultConfig } from 'connectkit'
import { createConfig, http } from 'wagmi'

import type { Chain } from 'wagmi/chains'

export const statusNetworkTestnet: Chain = {
  id: 1660990954,
  name: 'Status Network Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://public.sepolia.rpc.status.network'],
    },
    public: {
      http: ['https://public.sepolia.rpc.status.network'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Status Explorer',
      url: 'https://sepoliascan.status.network',
    },
  },
}

export const getDefaultWagmiConfig = () => {
  return getDefaultConfig({
    chains: [statusNetworkTestnet],
    transports: {
      [statusNetworkTestnet.id]: http(),
    },
    enableFamily: false,
    // TODO: move to env
    walletConnectProjectId: '7ab664eee6a734b14327cdf4678a3431',
    appName: 'Status Hub',
    appDescription: 'Status Network DeFi Dashboard',
    appUrl: 'https://status.app',
    appIcon: 'https://status.app/icon.png',
  })
}

export const wagmiConfig = createConfig(getDefaultWagmiConfig())
