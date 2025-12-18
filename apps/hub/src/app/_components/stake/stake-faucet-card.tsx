'use client'

import { useMemo } from 'react'

import { Skeleton } from '@status-im/components'
import { Button } from '@status-im/status-network/components'
import { useSIWE } from 'connectkit'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useAccount, useBalance } from 'wagmi'

import { STT_TOKEN } from '~constants/index'
import { TIME_CONSTANTS } from '~constants/staking'
import { useFaucetMutation, useFaucetQuery } from '~hooks/useFaucet'
import { formatSTT } from '~utils/currency'

import { useEmergencyModeEnabled } from '../../_hooks/useEmergencyModeEnabled'

const FaucetCardSkeleton = () => {
  const t = useTranslations()

  return (
    <div className="flex flex-col gap-6 rounded-16 border border-neutral-10 bg-white-100 p-6 shadow-2 md:flex-row md:items-center md:justify-between md:gap-8 md:rounded-32 md:py-4 md:pl-4 md:pr-8">
      <h3 className="text-19 font-500 md:hidden">{t('stake.faucet_title')}</h3>

      <div className="flex items-end gap-4 md:items-center md:gap-6">
        <Image
          width="103"
          height="124"
          src="/piggy-bank.png"
          alt={t('stake.piggy_bank_alt')}
          className="-ml-2 -mt-4 shrink-0 md:-ml-0 md:-mt-0"
        />

        <div className="flex flex-col gap-4">
          <h3 className="hidden text-19 font-500 md:block">
            {t('stake.faucet_title')}
          </h3>
          <div className="flex flex-col flex-wrap gap-x-14 gap-y-2 lg:flex-row">
            <div className="flex flex-col gap-1.5 text-13 font-500">
              <p className="text-neutral-50">{t('stake.daily_limit')}</p>
              <Skeleton height={18} width={80} className="rounded-6" />
            </div>
            <div className="flex flex-col gap-1.5 text-13 font-500">
              <p className="text-neutral-50">{t('stake.used_today')}</p>
              <Skeleton height={18} width={80} className="rounded-6" />
            </div>
            <div className="flex flex-col gap-1.5 text-13 font-500">
              <p className="text-neutral-50">{t('stake.available')}</p>
              <Skeleton height={18} width={80} className="rounded-6" />
            </div>
          </div>
        </div>
      </div>

      <Button className="self-end" disabled>
        {t('stake.claim_testnet_snt')}
      </Button>
    </div>
  )
}

const FaucetCard = () => {
  const t = useTranslations()
  const { data: faucetData, isLoading } = useFaucetQuery()
  const { isSignedIn, isLoading: isLoadingSIWE } = useSIWE()
  const { mutate: claimTokens, isPending: isClaimingTokens } =
    useFaucetMutation()
  const { address, isConnected, isConnecting } = useAccount()
  const { data: emergencyModeEnabled } = useEmergencyModeEnabled()

  const { refetch: refetchBalance } = useBalance({
    scopeKey: 'balance',
    address,
    token: STT_TOKEN.address,
    query: {
      enabled: isConnected,
    },
  })

  const hasReachedDailyLimit = useMemo(() => {
    if (!faucetData) return false

    const currentTimestamp = BigInt(
      Math.floor(Date.now() / TIME_CONSTANTS.MILLISECONDS_PER_SECOND)
    )
    const isWithinResetWindow = faucetData.accountResetTime > currentTimestamp
    const hasExceededLimit =
      faucetData.accountDailyRequests >= faucetData.dailyLimit

    return hasExceededLimit && isWithinResetWindow
  }, [faucetData])

  if (isLoading || isConnecting || isLoadingSIWE) {
    return <FaucetCardSkeleton />
  }

  return (
    <div className="flex flex-col gap-6 rounded-16 border border-neutral-10 bg-white-100 p-6 shadow-2 md:flex-row md:items-center md:justify-between md:gap-8 md:rounded-32 md:py-4 md:pl-4 md:pr-8">
      <h3 className="text-19 font-500 md:hidden">{t('stake.faucet_title')}</h3>

      <div className="flex items-end gap-4 md:items-center md:gap-6">
        <Image
          width="103"
          height="124"
          src="/piggy-bank.png"
          alt={t('stake.piggy_bank_alt')}
          className="-ml-2 -mt-4 shrink-0 md:-ml-0 md:-mt-0"
        />

        <div className="flex flex-col gap-4">
          <h3 className="hidden text-19 font-500 md:block">
            {t('stake.faucet_title')}
          </h3>
          <div className="flex flex-col flex-wrap gap-x-14 gap-y-2 lg:flex-row">
            <div className="flex flex-col gap-1.5 text-13 font-500">
              <p className="text-neutral-50">{t('stake.daily_limit')}</p>
              <span className="text-15 font-500">
                {formatSTT(faucetData?.dailyLimit ?? 0, {
                  includeSymbol: true,
                })}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-13 font-500">
              <p className="text-neutral-50">{t('stake.used_today')}</p>
              <span className="text-15 font-500">
                {formatSTT(faucetData?.actualUsedToday ?? 0, {
                  includeSymbol: true,
                })}
              </span>
            </div>
            <div className="flex flex-col gap-1.5 text-13 font-500">
              <p className="text-neutral-50">{t('stake.available')}</p>
              <span className="text-15 font-500">
                {formatSTT(faucetData?.remainingAmount ?? 0, {
                  includeSymbol: true,
                })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full shrink-0 justify-center md:w-auto"
        disabled={
          !isConnected ||
          hasReachedDailyLimit ||
          isClaimingTokens ||
          !isSignedIn ||
          Boolean(emergencyModeEnabled)
        }
        onClick={() =>
          claimTokens(
            { amount: faucetData?.remainingAmount ?? BigInt(0) },
            {
              onSuccess: () => {
                refetchBalance()
              },
            }
          )
        }
      >
        {isClaimingTokens ? t('stake.claiming') : t('stake.claim_testnet_snt')}
      </Button>
    </div>
  )
}

export { FaucetCard, FaucetCardSkeleton }
