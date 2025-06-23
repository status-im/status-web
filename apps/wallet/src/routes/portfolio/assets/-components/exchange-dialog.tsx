import { CloseIcon } from '@status-im/icons/20'
import { LifiWidget } from '@status-im/wallet/components'

type Props = {
  onClose: () => void
}

const ExchangeDialog = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="relative w-full max-w-[400px] rounded-20 p-4">
        <div className="flex items-center justify-end pb-3">
          <button onClick={onClose} className="p-1">
            <CloseIcon />
          </button>
        </div>
        <LifiWidget />
      </div>
    </div>
  )
}

export { ExchangeDialog }
