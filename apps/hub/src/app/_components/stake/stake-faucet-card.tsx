'use client'

import { useMemo } from 'react'

import { Skeleton } from '@status-im/components'
import { PlaceholderIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import Image from 'next/image'
import { useAccount } from 'wagmi'

import { TIME_CONSTANTS } from '~constants/staking'
import { useFaucetMutation, useFaucetQuery } from '~hooks/useFaucet'
import { formatSNT } from '~utils/currency'

const FaucetCard = () => {
  const { data: faucetData, isLoading } = useFaucetQuery()
  const { mutate: claimTokens, isPending: isClaimingTokens } =
    useFaucetMutation()
  const { isConnected, isConnecting } = useAccount()

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

  if (isLoading || isConnecting) {
    return (
      <div className="flex flex-col gap-8 rounded-32 border border-neutral-10 bg-white-100 p-6 shadow-2 md:flex-row md:items-center md:justify-between md:p-8">
        <div className="flex items-start gap-4 md:gap-6">
          <div className="relative h-[88px]">
            <Image
              width="103"
              height="174"
              src="/piggy-bank.png"
              alt="Piggy Bank"
              className="-mt-12"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-19 font-500">Free Testnet SNT faucet</p>
            </div>

            <div className="flex flex-wrap gap-4 md:gap-6">
              <div className="min-w-[128px] space-y-1 text-13 font-500">
                <p className="text-neutral-50">Daily limit</p>
                <Skeleton height={18} width={80} className="rounded-6" />
              </div>
              <div className="min-w-[128px] space-y-1 text-13 font-500">
                <p className="text-neutral-50">Used today</p>
                <Skeleton height={18} width={80} className="rounded-6" />
              </div>
              <div className="min-w-[128px] space-y-1 text-13 font-500">
                <p className="text-neutral-50">Available</p>
                <Skeleton height={18} width={80} className="rounded-6" />
              </div>
            </div>
          </div>
        </div>

        <Button className="self-end" disabled>
          <PlaceholderIcon className="text-blur-white/70" />
          Claim testnet SNT
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8 rounded-32 border border-neutral-10 bg-white-100 p-6 shadow-2 md:flex-row md:items-center md:justify-between md:p-8">
      <div className="flex items-start gap-4 md:gap-6">
        <div className="relative h-[88px]">
          <Image
            width="103"
            height="174"
            src="/piggy-bank.png"
            alt="Piggy Bank"
            className="-mt-12"
          />
        </div>

        <div className="space-y-3">
          <div>
            <p className="text-19 font-500">Free Testnet SNT faucet</p>
          </div>

          <div className="flex flex-wrap gap-4 md:gap-6">
            <div className="min-w-[128px] space-y-1 text-13 font-500">
              <p className="text-neutral-50">Daily limit</p>
              <span>{formatSNT(faucetData?.dailyLimit ?? 0)} SNT</span>
            </div>
            <div className="min-w-[128px] space-y-1 text-13 font-500">
              <p className="text-neutral-50">Used today</p>
              <span>{formatSNT(faucetData?.actualUsedToday ?? 0)} SNT</span>
            </div>
            <div className="min-w-[128px] space-y-1 text-13 font-500">
              <p className="text-neutral-50">Available</p>
              <span>{formatSNT(faucetData?.remainingAmount ?? 0)} SNT</span>
            </div>
          </div>
        </div>
      </div>

      <Button
        className="self-end"
        disabled={!isConnected || hasReachedDailyLimit || isClaimingTokens}
        onClick={() =>
          claimTokens({ amount: faucetData?.remainingAmount ?? BigInt(0) })
        }
      >
        <PlaceholderIcon className="text-blur-white/70" />
        {isClaimingTokens ? 'Claiming...' : 'Claim testnet SNT'}
      </Button>
    </div>
  )
}

export { FaucetCard }
