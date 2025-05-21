'use client'

import { Suspense } from 'react'

import { Skeleton } from '@status-im/components'
import {
  Address,
  AssetsList,
  StickyHeaderContainer,
} from '@status-im/wallet/components'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'

import { ActionButtons } from '@/components/action-buttons'
import { TabLink } from '@/components/tab-link'

import type { CustomisationColorType } from '@status-im/wallet/components'

type Account = {
  name: string
  emoji: string
  color: CustomisationColorType
  address: string
  wallet?: {
    connector: string
    connected: boolean
  }
}

export const Route = createFileRoute('/portfolio/assets/')({
  component: RouteComponent,
  head: () => ({
    meta: [
      {
        title: 'Extension | Wallet | Portfolio',
      },
    ],
  }),
})

function RouteComponent() {
  const handleSelect = (url: string, options?: { scroll?: boolean }) => {
    // Handle the selection of an asset
    console.log('Selected asset URL:', url)
    console.log('Scroll option:', options?.scroll)
  }

  // todo: export trpc client with api router and used instead
  // todo: cache
  const { data: assets, isLoading } = useQuery({
    queryKey: ['assets'],
    queryFn: async () => {
      const url = new URL('http://localhost:3030/api/trpc/assets.all')
      url.searchParams.set(
        'input',
        // encodeURIComponent(
        JSON.stringify({
          json: {
            address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
            networks: [
              'ethereum',
              'optimism',
              'arbitrum',
              'base',
              'polygon',
              'bsc',
            ],
          },
        }),
        // ),
      )

      // note: http://localhost:3030/api/trpc/assets.all?input={"json":{"address":"0xd8da6bf26964af9d7eed9e03e53415d37aa96045","networks":["ethereum","optimism","arbitrum","base","polygon","bsc"]}}
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error('Failed to fetch.')
      }

      const body = await response.json()

      return body.result.data.json.assets
    },
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 60 * 60 * 1000, // 1 hour
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })

  const data = {
    summary: 'Summary',
    totalBalance: '€203.00',
  }

  const account: Account = {
    name: 'Account Name',
    emoji: '👤',
    color: 'blue',
    address: '0xd8da6bf26964af9d7eed9e03e53415d37aa96045',
  }

  const actionsButtonsData = {
    address: 'portfolio', // This should be the address of the account coming from the URL. Wrote to have active state
    pathname: '/portfolio/assets',
    searchAndSortValues: {
      inputValue: '',
      updateSearchParam: () => {},
      orderByColumn: 'name',
      ascending: true,
      onOrderByChange: () => {},
      sortOptions: {
        name: 'Name',
        balance: 'Balance',
        '24h': '24H%',
        value: 'Value',
        price: 'Price',
      },
    },
  }

  return (
    <div className="grid flex-1 divide-x divide-neutral-10 overflow-hidden xl:grid-cols-[auto_1fr]">
      {/* Sidebar nav */}
      <div className="hidden px-3 py-2 xl:block">nav</div>

      {/* Main content */}
      <div className="flex divide-x divide-default-neutral-20">
        <div className="flex grow flex-col 2xl:basis-1/2">
          <div className="relative h-[calc(100vh-100px)] overflow-auto">
            {isLoading ? (
              <div className="flex min-h-full items-center justify-center">
                <div className="size-5 animate-spin rounded-full border-b-2 border-neutral-50"></div>
              </div>
            ) : (
              <StickyHeaderContainer
                className="-translate-x-0 !py-3 !pl-3 pr-[50px] 2xl:w-auto 2xl:!px-12 2xl:!py-4"
                leftSlot={
                  <Suspense
                    fallback={
                      <div className="flex items-center gap-2">
                        <Skeleton
                          height={20}
                          width={20}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={20}
                          width={160}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                    }
                  >
                    <div className="font-medium">{data.summary}</div>
                  </Suspense>
                }
                rightSlot={
                  <div className="flex items-center gap-2">
                    <TabLink href="/portfolio/assets">Assets</TabLink>
                    <TabLink href="/portfolio/collectibles">
                      Collectibles
                    </TabLink>
                  </div>
                }
                secondaryLeftSlot={
                  <Suspense
                    fallback={
                      <div className="flex items-center gap-2">
                        <Skeleton
                          height={20}
                          width={20}
                          className="rounded-10"
                          variant="secondary"
                        />
                        <Skeleton
                          height={20}
                          width={160}
                          className="rounded-10"
                          variant="secondary"
                        />
                      </div>
                    }
                  >
                    <div className="text-19 font-medium">
                      {data.totalBalance}
                    </div>
                  </Suspense>
                }
              >
                <div className="relative flex flex-1 flex-col">
                  <div className="flex flex-col gap-2">
                    <Address variant="address-info" account={account} />
                    <div className="mb-6">
                      <div className="flex items-start gap-2">
                        <Suspense
                          fallback={
                            <div className="mt-[10px] flex flex-col gap-3">
                              <Skeleton
                                height={20}
                                width={160}
                                className="rounded-10"
                                variant="secondary"
                              />
                              <div className="flex items-center gap-1">
                                <Skeleton
                                  height={14}
                                  width={14}
                                  className="rounded-10"
                                  variant="secondary"
                                />
                                <Skeleton
                                  height={14}
                                  width={36}
                                  className="rounded-10"
                                  variant="secondary"
                                />
                                <Skeleton
                                  height={2}
                                  width={2}
                                  className="rounded-10"
                                  variant="secondary"
                                />
                                <Skeleton
                                  height={14}
                                  width={60}
                                  className="rounded-10"
                                  variant="secondary"
                                />
                              </div>
                            </div>
                          }
                        >
                          <div className="pt-1">{data.totalBalance}</div>
                        </Suspense>
                        <div className="pt-2">{/* <NetworksFilter /> */}</div>
                      </div>
                    </div>
                    <ActionButtons {...actionsButtonsData} />
                  </div>

                  {assets ? (
                    <AssetsList
                      assets={assets}
                      onSelect={handleSelect}
                      clearSearch={() => {
                        console.log('Search cleared')
                      }}
                      searchParams={new URLSearchParams()}
                      pathname="/portfolio/"
                    />
                  ) : (
                    <div className="mt-4 flex flex-col gap-3">Empty state</div>
                  )}
                </div>
              </StickyHeaderContainer>
            )}
          </div>
        </div>

        <div className="hidden basis-1/2 flex-col bg-neutral-10 2xl:flex">
          {/* {detail} */}
        </div>
      </div>
    </div>
  )
}
