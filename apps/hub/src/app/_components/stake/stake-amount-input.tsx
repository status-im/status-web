import { Skeleton } from '@status-im/components'
import { type UseFormRegister } from 'react-hook-form'

import { SNTIcon } from '~components/icons'
import { formatCurrency, formatSNT } from '~utils/currency'

type StakeAmountInputProps = {
  value: string
  balance?: bigint
  amountInUSD?: number
  onMaxClick: () => void
  register: UseFormRegister<any>
  isConnected: boolean
  isLoading?: boolean
}

const StakeAmountInput = ({
  value,
  balance,
  amountInUSD = 0,
  onMaxClick,
  register,
  isConnected,
  isLoading = false,
}: StakeAmountInputProps) => {
  if (isLoading) {
    return (
      <div className="space-y-2">
        <label
          htmlFor="stake-amount"
          className="block text-13 font-medium text-neutral-50"
        >
          Amount to stake
        </label>
        <div className="rounded-12 border border-neutral-20 bg-white-100 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-27 font-semibold text-neutral-40">0</span>
            <div className="flex items-center gap-1">
              <SNTIcon />
              <span className="text-19 font-semibold text-neutral-80">SNT</span>
            </div>
          </div>
          <div className="-mx-4 my-3 h-px w-[calc(100%+32px)] bg-neutral-10" />
          <div className="flex items-center justify-between text-13 font-500 text-neutral-50">
            <Skeleton height={18} width={100} className="rounded-6" />
            <Skeleton height={18} width={100} className="rounded-6" />
          </div>
        </div>
      </div>
    )
  }

  if (!isConnected) {
    return (
      <div className="space-y-2 opacity-[40%]">
        <label
          htmlFor="stake-amount"
          className="block text-13 font-medium text-neutral-50"
        >
          Amount to stake
        </label>
        <div className="rounded-12 border border-neutral-20 bg-white-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <input
              id="stake-amount"
              type="text"
              value={value}
              readOnly
              className="w-full border-none bg-transparent text-27 font-semibold text-neutral-40 outline-none"
            />
            <div className="flex items-center gap-1">
              <SNTIcon />
              <span className="text-19 font-semibold text-neutral-80">SNT</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="stake-amount"
        className="block text-13 font-medium text-neutral-50"
      >
        Amount to stake
      </label>
      <div className="rounded-16 border border-neutral-20 bg-white-100 px-4 py-3">
        <div className="flex items-center justify-between">
          <input
            id="stake-amount"
            type="text"
            inputMode="decimal"
            {...register('amount')}
            placeholder="0"
            className="h-[38px] w-full border-none bg-transparent text-27 font-semibold text-neutral-100 outline-none placeholder:text-neutral-40"
          />
          <div className="flex items-center gap-1">
            <SNTIcon />
            <span className="text-19 font-semibold text-neutral-80">SNT</span>
          </div>
        </div>
        <div className="-mx-4 my-3 h-px w-[calc(100%+32px)] bg-neutral-10" />
        <div className="flex items-center justify-between border-neutral-10 text-13 font-500 text-neutral-50">
          <span>{formatCurrency(amountInUSD)}</span>
          <button
            type="button"
            onClick={onMaxClick}
            className="uppercase text-neutral-100"
          >
            {`MAX ${formatSNT(balance ?? 0)} SNT`}
          </button>
        </div>
      </div>
    </div>
  )
}

export { StakeAmountInput }
export type { StakeAmountInputProps }
