'use client'

import { HubLayout } from '~components/hub-layout'
import {
  KarmaOverviewCard,
  KarmaSourceCard,
  KarmaVisualCard,
} from '~components/karma'

import type { KarmaOverviewData } from '~types/karma'

export default function KarmaPage() {
  // TODO: Replace with actual data from API/state
  const karmaData: KarmaOverviewData = {
    isLoading: false,
    currentKarma: 55129.16,
    rank: 512,
    achievements: [
      'LIQUIDITY_PROVIDER',
      'SERIAL_STAKER',
      'APPS_TRAVELER',
      'GENEROUS_TIPPER',
    ],
  }

  const visualData = {
    imageSrc: '/karma/media.png',
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

  // TODO: Replace with actual karma sources from API/state
  const karmaSources = [
    {
      title: 'Welcome Karma',
      amount: 240.2,
      onComplete: (token: string) => {
        console.log('Complete clicked with token:', token)
      },
      isComplete: false,
      isLoading: false,
    },
  ]

  return (
    <HubLayout>
      <div className="mx-auto flex size-full flex-col gap-8 p-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-64 font-bold text-neutral-100">Karma</h1>
          <p className="text-19 font-regular text-neutral-100">
            Increase your Karma, unlock more free transactions, gain power over
            the network
          </p>
        </div>
        <div className="flex flex-col gap-6 md:flex-row">
          <KarmaVisualCard {...visualData} />
          <KarmaOverviewCard {...karmaData} />
        </div>
        <div className="flex flex-col gap-6">
          <h2 className="text-19 font-semibold text-neutral-100">
            Karma breakdown
          </h2>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {karmaSources.map((source, index) => (
              <KarmaSourceCard key={index} {...source} />
            ))}
          </div>
        </div>
      </div>
    </HubLayout>
  )
}
