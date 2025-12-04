'use client'

import { Button } from '@status-im/status-network/components'
import Image from 'next/image'

import { formatCurrency, formatTokenAmount } from '~/utils/currency'
import { usePreDepositTVLInUSD } from '~hooks/usePreDepositTVLInUSD'

import { DollarIcon, PercentIcon, PlusIcon } from './icons'

import type { Vault } from '~constants/index'
import type { FC } from 'react'

type Props = {
  vault: Vault
  onDeposit: () => void
  /** User's deposited balance in wei (optional - shows deposit info when provided) */
  depositedBalance?: bigint
}

const VaultCard: FC<Props> = ({
  vault,
  onDeposit,
  depositedBalance,
}: Props) => {
  const { apy, rewards, icon, token } = vault
  const { data: tvlData } = usePreDepositTVLInUSD({ vault })

  const apyValue = apy.endsWith('%') ? apy.slice(0, -1) : apy
  const rewardsLine = rewards.join(', ') + ' points'

  const formattedTVL = !vault.soon
    ? formatCurrency(tvlData?.tvlUSD ?? 0, { compact: true }).replace('$', '')
    : null

  const showDeposit = !vault.soon

  return (
    <div className="size-full rounded-32 border border-neutral-20 bg-white-100 p-4 shadow-1 lg:p-8">
      {/* header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              className="flex size-10 items-center justify-center rounded-full"
              src={`/vaults/${icon.toLowerCase()}.png`}
              alt={icon}
              width="56"
              height="56"
            />

            <div className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full border-2 border-neutral-5 bg-white-100">
              <Image
                src="/tokens/KARMA.png"
                alt="KARMA"
                width="16"
                height="16"
              />
            </div>
          </div>
        </div>
      </div>

      <h3 className="mb-2 text-19 font-600 lg:text-27">{vault.name}</h3>

      {showDeposit && (
        <div className="mb-4">
          <p className="text-15 font-400 text-neutral-50">Deposited</p>
          <p className="text-27 font-600">
            {formatTokenAmount(depositedBalance ?? 0n, token.symbol, {
              tokenDecimals: token.decimals,
              decimals: 0,
              includeSymbol: true,
            })}
          </p>
        </div>
      )}

      {/* meta */}
      <ul className="my-4 space-y-2">
        {apyValue && (
          <li className="flex items-center gap-2 text-13">
            <span className="text-neutral-50">
              <PercentIcon />
            </span>
            <span>{apyValue} liquid APY</span>
          </li>
        )}
        <li className="flex items-center gap-2 text-13">
          <span className="text-neutral-50">
            <PlusIcon />
          </span>
          <span>{rewardsLine}</span>
        </li>
        {formattedTVL && (
          <li className="flex items-center gap-2 text-13">
            <span className="text-neutral-50">
              <DollarIcon />
            </span>
            <span>{formattedTVL} TVL</span>
          </li>
        )}
      </ul>

      {/* cta */}
      <Button
        size="40"
        onClick={onDeposit}
        disabled={vault.soon}
        className="w-full justify-center lg:w-auto"
      >
        {vault.soon ? 'Coming soon' : 'Deposit'}
      </Button>
    </div>
  )
}

export { VaultCard }
