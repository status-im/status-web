'use client'

import { type FC, useEffect, useRef, useState } from 'react'

import { Skeleton } from '@status-im/components'
import { Button } from '@status-im/status-network/components'
import { ConnectKitButton } from 'connectkit'
import { cva } from 'cva'
import { useAccount } from 'wagmi'

import { formatCurrency, formatTokenAmount } from '~/utils/currency'
import { type Vault } from '~constants/index'
import { usePreDepositTVL } from '~hooks/usePreDepositTVL'
import { usePreDepositTVLInUSD } from '~hooks/usePreDepositTVLInUSD'
import { useUserVaultDeposit } from '~hooks/useUserVaultDeposit'
import { useVaultsAPY } from '~hooks/useVaultsAPY'

import {
  DollarIcon,
  GusdIcon,
  KarmaCircleIcon,
  PercentIcon,
  PlusIcon,
  SumIcon,
} from './icons'
import { InfoTooltip } from './info-tooltip'
import { VaultImage } from './vault-image'

type Props = {
  vault: Vault
  onDeposit: () => void
  registerRefetch?: (vaultId: string, refetch: () => void) => void
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

type VaultCardSkeletonProps = {
  isConnected?: boolean
}

const VaultCardSkeleton: FC<VaultCardSkeletonProps> = ({
  isConnected = false,
}) => {
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

      {isConnected && (
        <div className="mb-4">
          <Skeleton width={80} height={20} className="mb-1 rounded-6" />
          <Skeleton width={120} height={32} className="rounded-8" />
        </div>
      )}

      {/* meta */}
      <ul className="my-4 space-y-2">
        <li className="flex items-center gap-2">
          <Skeleton width={20} height={20} className="rounded-full" />
          <Skeleton width={50} height={20} className="rounded-6" />
        </li>
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
        <li className="flex items-center gap-2">
          <Skeleton width={20} height={20} className="rounded-full" />
          <Skeleton width={100} height={20} className="rounded-6" />
        </li>
      </ul>

      {/* cta */}
      <Skeleton width={90} height={40} className="mt-auto rounded-12" />
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
  registerRefetch,
  show,
  isConnected,
  pendingDepositRef,
}) => {
  const { rewards, icon, token } = vault
  const { data: tvlData, isLoading: isTvlLoading } = usePreDepositTVLInUSD({
    vault,
  })
  const { data: totalAssets } = usePreDepositTVL({ vault })
  const { data: apyMap, isLoading: isApyLoading } = useVaultsAPY()
  const { data: depositedBalance, isLoading: isDepositedBalanceLoading } =
    useUserVaultDeposit({
      vault,
      registerRefetch,
    })

  useEffect(() => {
    if (isConnected && pendingDepositRef.current) {
      pendingDepositRef.current = false
      onDeposit()
    }
  }, [isConnected, onDeposit, pendingDepositRef])

  const vaultAddressLower = vault.address.toLowerCase()
  const isVaultInApi = apyMap !== undefined && vaultAddressLower in apyMap
  const isDisabled = !isVaultInApi
  const dynamicApy = apyMap?.[vaultAddressLower]
  const apyValue = dynamicApy !== undefined ? String(dynamicApy) : null
  const rewardsLine = rewards.join(', ')

  const formattedTVL = !isDisabled
    ? formatCurrency(tvlData?.tvlUSD ?? 0, { compact: true }).replace('$', '')
    : null

  const displayDecimals = token.symbol === 'WETH' ? 4 : 0

  const formattedTokenAmount = !isDisabled
    ? formatTokenAmount(totalAssets ?? 0n, token.symbol, {
        tokenDecimals: token.decimals,
        decimals: displayDecimals,
        includeSymbol: true,
      })
    : null

  const handleClick = () => {
    if (isConnected) {
      onDeposit()
    } else {
      pendingDepositRef.current = true
      show?.()
    }
  }

  return (
    <div className={vaultCardStyles({ disabled: isDisabled })}>
      {/* header */}
      <div className="mb-6 flex items-start justify-between">
        <div className="flex items-center gap-4">
          <VaultImage vault={icon} network={vault.network} size="56" />
        </div>
        <InfoTooltip content="Estimated APY based on TVL and total available liquid token rewards across all vaults: 15M SNT + 20M LINEA" />
      </div>

      <h3 className="mb-2 text-19 font-600 lg:text-27">{vault.name}</h3>

      {!isDisabled && isConnected && (
        <div className="mb-4">
          <p className="text-15 font-400 text-neutral-50">Your deposit</p>
          <div className="text-27 font-600">
            {isDepositedBalanceLoading ? (
              <Skeleton width={120} height={32} className="rounded-8" />
            ) : (
              formatTokenAmount(depositedBalance ?? 0n, token.symbol, {
                tokenDecimals: token.decimals,
                decimals: displayDecimals,
                includeSymbol: true,
              })
            )}
          </div>
        </div>
      )}

      {/* meta */}
      <ul className="my-4 space-y-2">
        <li className="flex items-center gap-2 text-15">
          <span className="text-purple">
            <KarmaCircleIcon />
          </span>
          <span className="text-neutral-100">KARMA</span>
        </li>
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
        {vault.id === 'GUSD' && (
          <li className="flex items-center gap-2 text-15">
            <span className="text-neutral-50">
              <GusdIcon />
            </span>
            <span>Generic Protocol points</span>
          </li>
        )}
        <li className="flex items-center gap-2 text-15">
          <span className="text-neutral-50">
            <DollarIcon />
          </span>
          {isTvlLoading ? (
            <Skeleton width={80} height={20} className="rounded-6" />
          ) : (
            <span>{formattedTVL ? `$${formattedTVL} TVL` : 'TVL TBD'}</span>
          )}
        </li>
        {!isDisabled && (
          <li className="flex items-center gap-2 text-15">
            <span className="text-neutral-50">
              <SumIcon />
            </span>
            <span>{formattedTokenAmount}</span>
          </li>
        )}
      </ul>

      {/* cta */}
      <Button
        size="40"
        onClick={handleClick}
        disabled={isDisabled}
        className="mt-auto w-full justify-center lg:w-fit"
      >
        {isDisabled ? 'Coming soon' : 'Deposit'}
      </Button>
    </div>
  )
}

const VaultCard: FC<Props> = props => {
  const pendingDepositRef = useRef(false)
  const [isMounted, setIsMounted] = useState(false)
  const { isLoading: isApyLoading } = useVaultsAPY()
  const { isConnected } = useAccount()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const stableIsConnected = isMounted ? isConnected : false

  if (!isMounted || isApyLoading) {
    return <VaultCardSkeleton isConnected={stableIsConnected} />
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
