'use client'

import { type FC, useEffect, useRef, useState } from 'react'

import { Skeleton, Tooltip } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import { Button } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'
import { cva } from 'cva'

import { formatCurrency, formatTokenAmount } from '~/utils/currency'
import { TOOLTIP_CONFIG, type Vault } from '~constants/index'
import { usePreDepositTVLInUSD } from '~hooks/usePreDepositTVLInUSD'
import { useVaultsAPY } from '~hooks/useVaultsAPY'

import { DollarIcon, GusdIcon, PercentIcon, PlusIcon } from './icons'
import { VaultImage } from './vault-image'

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

const VaultCardSkeleton: FC = () => {
  return (
    <div className={vaultCardStyles()}>
      {/* header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <Skeleton width={56} height={56} className="rounded-full" />
        </div>
      </div>

      {/* title */}
      <Skeleton width={180} height={28} className="mb-2 rounded-8" />

      {/* meta */}
      <ul className="my-4 space-y-2">
        <li className="flex items-center gap-2">
          <Skeleton width={20} height={20} className="rounded-full" />
          <Skeleton width={120} height={20} className="rounded-6" />
        </li>
        <li className="flex items-center gap-2">
          <Skeleton width={20} height={20} className="rounded-full" />
          <Skeleton width={140} height={20} className="rounded-6" />
        </li>
        <li className="flex items-center gap-2">
          <Skeleton width={20} height={20} className="rounded-full" />
          <Skeleton width={100} height={20} className="rounded-6" />
        </li>
      </ul>

      {/* cta */}
      <Skeleton width={100} height={40} className="mt-auto rounded-12" />
    </div>
  )
}

type VaultCardContentProps = Props & {
  show?: () => void
  isConnected: boolean
  pendingDepositRef: React.MutableRefObject<boolean>
}

const VaultCardContent: FC<VaultCardContentProps> = ({
  vault,
  onDeposit,
  depositedBalance,
  show,
  isConnected,
  pendingDepositRef,
}) => {
  const { rewards, icon, token } = vault
  const { data: tvlData, isLoading: isTvlLoading } = usePreDepositTVLInUSD({
    vault,
  })
  const { data: apyMap, isLoading: isApyLoading } = useVaultsAPY()

  useEffect(() => {
    if (isConnected && pendingDepositRef.current) {
      pendingDepositRef.current = false
      onDeposit()
    }
  }, [isConnected, onDeposit, pendingDepositRef])

  // Get APY from API, fallback to static vault config
  const dynamicApy = apyMap?.[vault.address.toLowerCase()]
  const apyValue = dynamicApy !== undefined ? String(dynamicApy) : null
  const rewardsLine = rewards.join(', ') + ' points'

  const formattedTVL = !vault.soon
    ? formatCurrency(tvlData?.tvlUSD ?? 0, { compact: true }).replace('$', '')
    : null

  const showDepositSection = !vault.soon

  const handleClick = () => {
    if (isConnected) {
      onDeposit()
    } else {
      pendingDepositRef.current = true
      show?.()
    }
  }

  return (
    <div className={vaultCardStyles({ disabled: !!vault.soon })}>
      {/* header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <VaultImage vault={icon} network={vault.network} size="56" />
        </div>
      </div>

      <div className="absolute right-4 top-4 hidden size-4 md:block">
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

      {showDepositSection && isConnected && (
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
          {isApyLoading ? (
            <Skeleton width={120} height={20} className="rounded-6" />
          ) : (
            <span>
              {apyValue ? `${apyValue}% liquid APY` : 'Liquid APY TBD'}
            </span>
          )}
        </li>
        <li className="flex items-center gap-2 text-15">
          <span className="text-neutral-50">
            <PlusIcon />
          </span>
          <span>{rewardsLine}</span>
        </li>
        <li className="flex items-center gap-2 text-15">
          <span className="text-neutral-50">
            <DollarIcon />
          </span>
          {isTvlLoading ? (
            <Skeleton width={80} height={20} className="rounded-6" />
          ) : (
            <span>{formattedTVL ? `${formattedTVL} TVL` : 'TVL TBD'}</span>
          )}
        </li>
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
        onClick={handleClick}
        disabled={vault.soon}
        className="mt-auto w-full justify-center lg:w-fit"
      >
        {vault.soon ? 'Coming soon' : 'Deposit'}
      </Button>
    </div>
  )
}

const VaultCard: FC<Props> = props => {
  const pendingDepositRef = useRef(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <VaultCardSkeleton />
  }

  return (
    <ConnectKitButton.Custom>
      {({ show, isConnected }: { show?: () => void; isConnected: boolean }) => (
        <VaultCardContent
          {...props}
          show={show}
          isConnected={isConnected}
          pendingDepositRef={pendingDepositRef}
        />
      )}
    </ConnectKitButton.Custom>
  )
}

export { VaultCard, VaultCardSkeleton }
