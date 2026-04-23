import { AlertIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { NetworkLogo } from '../network-logo'

import type { NetworkType } from '../../data'

type Props = {
  isErc1155: boolean
  amount: string
  onAmountChange: (value: string) => void
  displayName: string
  collectibleImage?: string
  network: NetworkType
  isFractionalAmount: boolean
  balance?: bigint
}

const deriveSymbol = (displayName: string) => displayName.split(/\s+/)[0] ?? ''

const AmountField = ({
  isErc1155,
  amount,
  onAmountChange,
  displayName,
  collectibleImage,
  network,
  isFractionalAmount,
  balance,
}: Props) => {
  const symbol = deriveSymbol(displayName)
  const isIntegerAmount = /^\d+$/.test(amount)

  const amountBig = isIntegerAmount ? BigInt(amount) : null

  const isOverBalance =
    isErc1155 &&
    balance !== undefined &&
    amountBig !== null &&
    amountBig > balance

  const showBalanceRow = isErc1155 && balance !== undefined

  const remaining =
    isErc1155 && balance !== undefined && !isOverBalance
      ? balance - (amountBig ?? 0n)
      : undefined

  return (
    <div className="flex flex-col gap-2 px-4 pb-4">
      <p className="text-13 font-medium text-neutral-50">Amount</p>

      <div className="flex flex-col overflow-hidden rounded-12 border border-neutral-20 bg-white-100 py-3">
        {/* 1st line */}
        <div className="flex h-9 items-center justify-between px-4">
          {isErc1155 ? (
            <input
              type="number"
              min={1}
              step={1}
              value={amount}
              placeholder="0"
              onChange={e => onAmountChange(e.target.value)}
              className={cx(
                'size-full min-w-0 pr-4 text-27 font-semibold',
                '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                (isFractionalAmount || isOverBalance) && 'text-danger-50',
              )}
            />
          ) : (
            <div className="flex h-full items-center pr-4 text-27 font-semibold text-neutral-40">
              1
            </div>
          )}

          <div className="flex shrink-0 items-center gap-1">
            {collectibleImage && (
              <div className="relative size-8 shrink-0">
                <img
                  src={collectibleImage}
                  alt={displayName}
                  className="size-full rounded-8 object-cover"
                />
                <div className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-white-100">
                  <NetworkLogo name={network} size={12} />
                </div>
              </div>
            )}
            <span className="max-w-28 truncate text-19 font-semibold text-neutral-100">
              {displayName}
            </span>
          </div>
        </div>

        {/* Divider + 2nd line: balance (ERC-1155 only) */}
        {showBalanceRow && (
          <>
            <div className="mx-4 mt-3 h-px w-[calc(100%-32px)] bg-neutral-10" />
            <div className="mt-3 flex h-4 items-center justify-end px-4 text-13 font-medium text-neutral-100">
              {balance.toString()} {symbol}
            </div>
          </>
        )}
      </div>

      {/* Errors below amount box */}
      {isOverBalance && (
        <div className="flex items-center gap-1 text-13 text-danger-50">
          <AlertIcon className="size-4 shrink-0" />
          <span>More than available balance</span>
        </div>
      )}
      {isFractionalAmount && (
        <div className="flex items-center gap-1 text-13 text-danger-50">
          <AlertIcon className="size-4 shrink-0" />
          <span>Can&apos;t send fraction of collectible</span>
        </div>
      )}

      {/* Remaining — matches Figma separate section; hide when 0 (sending full balance is valid) */}
      {isErc1155 &&
        remaining !== undefined &&
        remaining > 0n &&
        !isOverBalance && (
          <p className="text-13 font-medium text-neutral-50">
            Remaining: {remaining.toString()} {symbol}
          </p>
        )}
    </div>
  )
}

export { AmountField }
