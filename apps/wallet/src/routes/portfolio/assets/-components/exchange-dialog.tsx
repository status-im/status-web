import { CloseIcon } from '@status-im/icons/20'
import { LifiWidget } from '@status-im/wallet/components'

import { useWallet } from '@/providers/wallet-context'

import { supportedChains } from '../../../../../../portfolio/src/app/_config'

type Props = {
  onClose: () => void
  ticker: string
}

const ExchangeDialog = ({ onClose, ticker }: Props) => {
  const { currentWallet } = useWallet()

  // todo support auto select for other chains
  const availableChainId = supportedChains[0].id

  const getTokenAddress = () => {
    if (!ticker.startsWith('0x')) {
      // Native token
      return '0x0000000000000000000000000000000000000000'
    }
    // For ERC-20 tokens ticker is the contract address
    return ticker
  }

  console.log('currentWallet', currentWallet)

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
              allow: supportedChains.map(chain => chain.id),
            },
            fromChain: availableChainId,
            fromToken: getTokenAddress(),
            fromAmount: 0.1,
          }}
        />
      </div>
    </div>
  )
}

export { ExchangeDialog }
