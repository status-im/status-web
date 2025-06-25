import { CloseIcon } from '@status-im/icons/20'

import { LifiWidget } from '@/components/lifi-widget'
import { supportedChains } from '@/providers/wagmi-provider'

import type { ApiOutput, NetworkType } from '@status-im/wallet/data'

type Props = {
  onClose: () => void
  tokenData: ApiOutput['assets']['token'] | ApiOutput['assets']['nativeToken']
}

const getChainIdForNetwork = (network: NetworkType) => {
  const chainMap: Record<string, number> = {
    ethereum: 1,
    optimism: 10,
    arbitrum: 42161,
    base: 8453,
    polygon: 137,
    bsc: 56,
  }

  const chainId = chainMap[network]
  return supportedChains.find(chain => chain.id === chainId)?.id
}

const resolveChainId = (
  token: ApiOutput['assets']['token'] | ApiOutput['assets']['nativeToken'],
  supportedChainIds: number[],
): number | undefined => {
  if (!token?.assets) return undefined

  const tokenNetworks = Object.keys(token.assets) as NetworkType[]

  for (const network of tokenNetworks) {
    const chainId = getChainIdForNetwork(network)

    if (!chainId) continue
    if (!supportedChainIds.includes(chainId)) continue

    return chainId
  }

  return undefined
}

const ExchangeDialog = ({ onClose, tokenData }: Props) => {
  const supportedChainIds = supportedChains.map(chain => chain.id)
  const resolvedChainId = resolveChainId(tokenData, supportedChainIds)

  const getTokenAddress = (): string | undefined => {
    if (!resolvedChainId) return undefined

    const tokenNetworks = Object.keys(tokenData.assets) as NetworkType[]

    const resolvedNetwork = tokenNetworks.find(network => {
      const chainId = getChainIdForNetwork(network as NetworkType)
      return chainId === resolvedChainId
    })

    if (!resolvedNetwork) return undefined

    if (tokenData.assets[resolvedNetwork]?.native) {
      return '0x0000000000000000000000000000000000000000'
    }

    if (tokenData.assets[resolvedNetwork]?.contract) {
      return tokenData.assets[resolvedNetwork].contract!
    }

    return undefined
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full max-w-[400px] rounded-20 p-4">
        <div className="flex items-center justify-end pb-3">
          <button onClick={onClose} className="p-1">
            <CloseIcon />
          </button>
        </div>
        <LifiWidget
          config={{
            chains: {
              allow: supportedChainIds,
            },
            ...(resolvedChainId && { fromChain: resolvedChainId }),
            ...(getTokenAddress() && { fromToken: getTokenAddress() }),
            fromAmount: 1,
          }}
        />
      </div>
    </div>
  )
}

export { ExchangeDialog }
