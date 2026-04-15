import { Button } from '@status-im/components'
import { AlertIcon } from '@status-im/icons/20'
import { CurrencyAmount } from '@status-im/wallet/components'

import type { GasFees } from '../../../assets/-components/token-helpers'
import type { NetworkType } from '@status-im/wallet/data'

type Props = {
  gasFeeData?: GasFees
  isFetchingFees: boolean
  hasInsufficientEth: boolean
  network: NetworkType
  fromAddress: string
  canSubmit: boolean
  isSending: boolean
  onSend: () => void
}

const FeeValue = ({
  gasFeeData,
  isFetchingFees,
  field,
}: {
  gasFeeData?: GasFees
  isFetchingFees: boolean
  field: 'maxFeeEur' | 'feeEur' | 'confirmationTime'
}) => {
  if (!gasFeeData) return <span>{isFetchingFees ? '...' : '—'}</span>
  if (field === 'confirmationTime')
    return <span>{gasFeeData.confirmationTime}</span>
  return (
    <CurrencyAmount
      value={field === 'maxFeeEur' ? gasFeeData.maxFeeEur : gasFeeData.feeEur}
      format="standard"
    />
  )
}

const BottomBar = ({
  gasFeeData,
  isFetchingFees,
  hasInsufficientEth,
  network,
  fromAddress,
  canSubmit,
  isSending,
  onSend,
}: Props) => {
  return (
    <div className="relative shrink-0">
      {/* Red gradient alert banner — matches Figma pb-[4px] pt-[12px] px-[20px] */}
      {hasInsufficientEth && (
        <div
          className="flex h-10 items-center px-5 pb-1 pt-3"
          style={{
            backgroundImage:
              'linear-gradient(to bottom, rgba(233,84,96,0.05), rgba(233,84,96,0))',
          }}
        >
          <div className="flex w-full items-center gap-1 text-13">
            <AlertIcon className="size-4 shrink-0 text-danger-50" />
            <span className="flex-1 text-danger-50">
              Not enough ETH to pay gas fees
            </span>
            <Button
              variant="danger"
              size="24"
              href={`https://exchange.mercuryo.io/?type=buy&network=${network}&currency=ETH&address=${fromAddress}&hide_address=false&fix_address=true&widget_id=6a7eb330-2b09-49b7-8fd3-1c77cfb6cd47`}
            >
              Add ETH
            </Button>
          </div>
        </div>
      )}

      {/* Frosted glass background (fees + button) */}
      <div className="relative">
        <div className="bg-white-100/70 absolute inset-0 backdrop-blur-[20px]" />

        {/* Fees row — Figma pt-[12px] pb-[4px] px-[20px] */}
        <div className="relative px-5 pb-1 pt-3">
          <div className="flex gap-3 text-13">
            {hasInsufficientEth ? (
              <div>
                <p className="text-neutral-50">Fees</p>
                <p className="font-medium text-danger-50">
                  <FeeValue
                    gasFeeData={gasFeeData}
                    isFetchingFees={isFetchingFees}
                    field="feeEur"
                  />
                </p>
              </div>
            ) : (
              <>
                <div className="flex-1">
                  <p className="text-neutral-50">Max fees</p>
                  <p className="font-medium text-neutral-100">
                    <FeeValue
                      gasFeeData={gasFeeData}
                      isFetchingFees={isFetchingFees}
                      field="maxFeeEur"
                    />
                  </p>
                </div>
                <div className="flex-1">
                  <p className="text-neutral-50">Estimated</p>
                  <p className="font-medium text-neutral-100">
                    <FeeValue
                      gasFeeData={gasFeeData}
                      isFetchingFees={isFetchingFees}
                      field="confirmationTime"
                    />
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Button — Figma p-[16px] */}
        <div className="relative flex flex-col p-4">
          <Button variant="primary" onPress={onSend} disabled={!canSubmit}>
            {isSending ? 'Sending...' : 'Sign transaction'}
          </Button>
        </div>
      </div>
    </div>
  )
}

export { BottomBar }
