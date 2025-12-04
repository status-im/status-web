'use client'

import { Tooltip } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import { Button } from '@status-im/status-network/components'
import { cva } from 'cva'
import Image from 'next/image'
import { match } from 'ts-pattern'
import { linea, mainnet } from 'viem/chains'

import { formatCurrency, formatTokenAmount } from '~/utils/currency'
import { TOOLTIP_CONFIG, type Vault } from '~constants/index'
import { usePreDepositTVLInUSD } from '~hooks/usePreDepositTVLInUSD'
import { useVaultsAPY } from '~hooks/useVaultsAPY'

import { DollarIcon, GusdIcon, PercentIcon, PlusIcon } from './icons'

import type { FC } from 'react'

type Props = {
  vault: Vault
  onDeposit: () => void
  /** User's deposited balance in wei (optional - shows deposit info when provided) */
  depositedBalance?: bigint
}

const vaultCardStyles = cva({
  base: 'relative flex size-full flex-col rounded-32 border border-neutral-20 bg-white-100 p-4 shadow-1 lg:p-8',
  variants: {
    disabled: {
      true: 'pointer-events-none opacity-[.40]',
    },
  },
  defaultVariants: {
    disabled: false,
  },
})

const VaultCard: FC<Props> = ({
  vault,
  onDeposit,
  depositedBalance,
}: Props) => {
  const { rewards, icon, token } = vault
  const { data: tvlData } = usePreDepositTVLInUSD({ vault })
  const { data: apyMap } = useVaultsAPY()

  // Get APY from API, fallback to static vault config
  const dynamicApy = apyMap?.[vault.address.toLowerCase()]
  const apyValue = dynamicApy !== undefined ? String(dynamicApy) : null
  const rewardsLine = rewards.join(', ') + ' points'

  const formattedTVL = !vault.soon
    ? formatCurrency(tvlData?.tvlUSD ?? 0, { compact: true }).replace('$', '')
    : null

  const showDeposit = !vault.soon

  const networkImage = match(vault.network)
    .with(mainnet.name, () => '/networks/ethereum.png')
    .with(linea.name, () => '/networks/linea.png')
    .exhaustive()

  return (
    <div className={vaultCardStyles({ disabled: !!vault.soon })}>
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
              <Image src={networkImage} alt="KARMA" width="16" height="16" />
            </div>
          </div>
        </div>
      </div>

      <div className="absolute right-4 top-4 size-4">
        <Tooltip
          delayDuration={TOOLTIP_CONFIG.DELAY_DURATION}
          side="top"
          content={
            <div className="flex w-[286px] flex-col gap-4 rounded-8 bg-white-100 p-4">
              <span className="text-13 text-neutral-100">
                Estimated APY based on TVL and total available liquid token
                rewards across all vaults: 20M SNT + 20M LINEA
              </span>
            </div>
          }
        >
          <InfoIcon className="absolute right-4 top-3 size-4 text-neutral-50 hover:text-neutral-100" />
        </Tooltip>
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
        <li className="flex items-center gap-2 text-15">
          <span className="text-neutral-50">
            <PercentIcon />
          </span>
          <span>{apyValue ? `${apyValue}% liquid APY` : 'Liquid APY TBD'}</span>
        </li>
        <li className="flex items-center gap-2 text-15">
          <span className="text-neutral-50">
            <PlusIcon />
          </span>
          <span>{rewardsLine}</span>
        </li>
        {formattedTVL && (
          <li className="flex items-center gap-2 text-15">
            <span className="text-neutral-50">
              <DollarIcon />
            </span>
            <span>{formattedTVL} TVL</span>
          </li>
        )}
        {vault.id === 'GUSD' && (
          <li className="flex items-center gap-2 text-15">
            <span className="text-neutral-50">
              <GusdIcon />
            </span>
            <span>Generic Protocol points</span>
          </li>
        )}
      </ul>

      {/* cta */}
      <Button
        size="40"
        onClick={onDeposit}
        disabled={vault.soon}
        className="mt-auto w-full justify-center lg:w-fit"
      >
        {vault.soon ? 'Coming soon' : 'Deposit'}
      </Button>
    </div>
  )
}

export { VaultCard }
