'use client'

import { useMemo } from 'react'

import { KarmaOverviewCardSkeleton } from '@status-im/components'
import { useTranslations } from 'next-intl'
import { formatEther } from 'viem/utils'

import { HubLayout } from '~components/hub-layout'
import {
  KarmaSourceCard,
  KarmaSourceCardSkeleton,
  KarmaVisualCard,
  KarmaVisualCardSkeleton,
  OverviewCard,
} from '~components/karma'
import { NetworkSwitchErrorDialog } from '~components/network-switch-error-dialog'
import { useCurrentUser } from '~hooks/useCurrentUser'
import { useKarmaRewardsDistributor } from '~hooks/useKarmaRewardsDistributor'
import { useRequireStatusNetwork } from '~hooks/useRequireStatusNetwork'

import { jsonLD, JSONLDScript } from '../../_utils/json-ld'

function KarmaCardsSkeleton() {
  const t = useTranslations()

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row">
        <KarmaVisualCardSkeleton />
        <KarmaOverviewCardSkeleton />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-19 font-semibold text-neutral-100">
          {t('karma.receive_karma')}
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          <KarmaSourceCardSkeleton />
        </div>
      </div>
    </>
  )
}

function KarmaCards() {
  const t = useTranslations()
  const { data, isLoading, refetch } = useCurrentUser()
  const {
    data: rewardsData,
    isLoading: rewardsLoading,
    refetch: rewardsRefetch,
  } = useKarmaRewardsDistributor()

  // TODO: Replace with actual data from API/state
  const visualData = {
    imageSrc: '/karma/media.jpg',
    imageAlt: t('karma.karma_visual_alt'),
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
        title: t('karma.welcome_karma'),
        amount: formatEther(rewardsData?.balance ?? BigInt(0)),
        onComplete: async () => {
          refetch()
          rewardsRefetch()
        },
        isComplete: data?.connectedSybilProviders.includes('POW') ?? false,
        isLoading: rewardsLoading || isLoading,
        badgeTitle: t('karma.just_arrived'),
        badgeDescription: t('karma.just_arrived_description'),
      },
    ],
    [rewardsData, data, rewardsLoading, isLoading, refetch, rewardsRefetch, t]
  )

  return (
    <>
      <div className="flex flex-col gap-6 md:flex-row">
        <KarmaVisualCard {...visualData} />
        <OverviewCard />
      </div>
      <div className="flex flex-col gap-6">
        <h2 className="text-19 font-semibold text-neutral-100">
          {t('karma.receive_karma')}
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

const breadcrumbListSchema = jsonLD.breadcrumbList([
  {
    name: 'Hub',
    url: 'https://hub.status.network/',
  },
  {
    name: 'Karma',
    url: 'https://hub.status.network/karma',
  },
])

const softwareApplicationSchema = jsonLD.softwareApplication({
  name: 'Status Network Karma',
  applicationCategory: 'GovernanceSystem',
  operatingSystem: 'Web',
  url: 'https://hub.status.network/karma',
  description:
    'Non-transferable reputation system used for governance and incentives on Status Network.',
})

export default function KarmaPage() {
  const t = useTranslations()
  const {
    isCorrectChain,
    isConnected,
    isSwitching,
    hasSwitchError,
    dismissError,
  } = useRequireStatusNetwork()

  const showSkeleton =
    isConnected && (!isCorrectChain || isSwitching) && !hasSwitchError

  const handleRetry = () => {
    dismissError()
    window.location.reload()
  }

  return (
    <HubLayout>
      <JSONLDScript
        schema={[breadcrumbListSchema, softwareApplicationSchema]}
      />
      <NetworkSwitchErrorDialog
        open={hasSwitchError}
        onClose={dismissError}
        onRetry={handleRetry}
      />
      <div className="mx-auto flex size-full flex-col gap-4 p-4 lg:gap-8 lg:p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-27 font-bold text-neutral-100 lg:text-64">
            {t('karma.title')}
          </h1>
          <p className="text-13 font-regular text-neutral-100 lg:text-19">
            {t('karma.description')}
          </p>
        </div>
        {showSkeleton ? <KarmaCardsSkeleton /> : <KarmaCards />}
      </div>
    </HubLayout>
  )
}
