'use client'

import { useMemo } from 'react'

import { formatEther } from 'viem/utils'

import { HubLayout } from '~components/hub-layout'
import {
  KarmaOverviewCard,
  KarmaOverviewCardSkeleton,
  KarmaSourceCard,
  KarmaSourceCardSkeleton,
  KarmaVisualCard,
  KarmaVisualCardSkeleton,
} from '~components/karma'
import { useCurrentUser } from '~hooks/useCurrentUser'
import { useKarmaRewardsDistributor } from '~hooks/useKarmaRewardsDistributor'
import { useRequireStatusNetwork } from '~hooks/useRequireStatusNetwork'

function KarmaCardsSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row">
        <KarmaVisualCardSkeleton />
        <KarmaOverviewCardSkeleton />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-19 font-semibold text-neutral-100">
          Receive Karma
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <KarmaSourceCardSkeleton />
        </div>
      </div>
    </>
  )
}

function KarmaCards() {
  const { data, isLoading, refetch } = useCurrentUser()
  const {
    data: rewardsData,
    isLoading: rewardsLoading,
    refetch: rewardsRefetch,
  } = useKarmaRewardsDistributor()

  // TODO: Replace with actual data from API/state
  const visualData = {
    imageSrc: '/karma/media.jpg',
    imageAlt: 'Karma Visual',
    isLoading: false,
    onRefresh: () => {
      // TODO: Implement refresh logic
      console.log('Refresh clicked')
    },
    onDownload: () => {
      // TODO: Implement download logic
      console.log('Download clicked')
    },
  }

  const karmaSources = useMemo(
    () => [
      {
        title: 'Welcome Karma',
        amount: formatEther(rewardsData?.balance ?? BigInt(0)),
        onComplete: async () => {
          refetch()
          rewardsRefetch()
        },
        isComplete: data?.connectedSybilProviders.includes('POW') ?? false,
        isLoading: rewardsLoading || isLoading,
      },
    ],
    [rewardsData, data, rewardsLoading, isLoading, refetch, rewardsRefetch]
  )

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row">
        <KarmaVisualCard {...visualData} />
        <KarmaOverviewCard />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-19 font-semibold text-neutral-100">
          Receive Karma
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {karmaSources.map(source => (
            <KarmaSourceCard key={source.title} {...source} />
          ))}
        </div>
      </div>
    </>
  )
}

export default function KarmaPage() {
  const { isCorrectChain, isConnected, isSwitching } = useRequireStatusNetwork()

  const showSkeleton = isConnected && (!isCorrectChain || isSwitching)

  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-27 font-bold text-neutral-100 lg:text-64">
            Karma
          </h1>
          <p className="text-13 font-regular text-neutral-100 lg:text-19">
            Increase your Karma, unlock more free transactions, gain power over
            the network
          </p>
        </div>
        {showSkeleton ? <KarmaCardsSkeleton /> : <KarmaCards />}
      </div>
    </HubLayout>
  )
}
