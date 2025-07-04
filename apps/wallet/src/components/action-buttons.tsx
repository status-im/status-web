'use client'

// import { Input } from '@status-im/components'
// import { SearchIcon } from '@status-im/icons/20'
import { useState } from 'react'

import { Button } from '@status-im/components'
import { RefreshIcon } from '@status-im/icons/20'
import { DropdownSort } from '@status-im/wallet/components'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'

import { useRefetchToast } from '../hooks/use-refetch-toast'
// import { match, P } from 'ts-pattern'
import { TabLink } from './tab-link'

// const checkPathnameAndReturnTabValue = (
//   pathname: string,
// ): 'assets' | 'collectibles' => {
//   return match(pathname)
//     .with(P.string.includes('/assets'), () => 'assets')
//     .with(P.string.includes('/collectibles'), () => 'collectibles')
//     .otherwise(() => 'assets') as 'assets' | 'collectibles'
// }

// const placeholderText = {
//   assets: 'Search asset name or symbol',
//   collectibles: 'Search collection or collectible name',
// } as const

type Props = {
  address: string
  pathname: string
  searchAndSortValues: {
    inputValue: string
    updateSearchParam: (value: string) => void
    orderByColumn: string
    ascending: boolean
    onOrderByChange: (value: string | number, ascending: boolean) => void
    sortOptions: Record<string, string>
  }
}

const ActionButtons = (props: Props) => {
  const { address, searchAndSortValues } = props
  const queryClient = useQueryClient()
  const [isManualRefreshing, setIsManualRefreshing] = useState(false)

  const totalFetchingCount = useIsFetching()
  const isAnyQueryFetching = totalFetchingCount > 0

  // Use the refetch toast hook for manual refresh
  useRefetchToast({
    isRefreshing: isManualRefreshing,
    queryKeys: [
      ['assets', address],
      ['collectibles', address],
      ['activities', address],
      ['collectible'],
      ['token'],
    ],
  })

  //   const placeholder = placeholderText[checkPathnameAndReturnTabValue(pathname)]

  const handleRefresh = async () => {
    setIsManualRefreshing(true)

    const queries = queryClient.getQueryCache().getAll()
    const activeQueries = queries.filter(query => {
      const key = query.queryKey
      const hasObservers = query.getObserversCount() > 0

      const isWalletQuery =
        (Array.isArray(key) && key[0] === 'assets' && key[1] === address) ||
        (Array.isArray(key) &&
          key[0] === 'collectibles' &&
          key[1] === address) ||
        (Array.isArray(key) && key[0] === 'activities' && key[1] === address) ||
        (Array.isArray(key) && key[0] === 'collectible') ||
        (Array.isArray(key) && key[0] === 'token')

      return hasObservers && isWalletQuery
    })

    await Promise.all(
      activeQueries.map(query =>
        queryClient.refetchQueries({ queryKey: query.queryKey }),
      ),
    )

    setTimeout(() => setIsManualRefreshing(false), 100)
  }

  return (
    <div className="flex place-content-between">
      <div className="flex gap-1.5">
        <TabLink href={`/portfolio/assets`}>Assets</TabLink>
        <TabLink href={`/portfolio/collectibles`}>Collectibles</TabLink>
        <TabLink href={`/portfolio/activity`}>Activity</TabLink>
      </div>
      <div className="flex items-center gap-2">
        {/* <Input
          placeholder={placeholder}
          icon={<SearchIcon />}
          size="32"
          value={searchAndSortValues.inputValue}
          onChange={searchAndSortValues.updateSearchParam}
          clearable={!!searchAndSortValues.inputValue}
          aria-label="Search"
        /> */}
        <Button
          size="32"
          variant="outline"
          onPress={handleRefresh}
          icon={
            <RefreshIcon
              style={
                isAnyQueryFetching
                  ? { animation: 'spin 1s linear infinite' }
                  : {}
              }
            />
          }
          aria-label="Refresh data"
          disabled={isAnyQueryFetching}
        />
        <DropdownSort
          data={searchAndSortValues.sortOptions}
          onOrderByChange={searchAndSortValues.onOrderByChange}
          orderByColumn={searchAndSortValues.orderByColumn}
          ascending={searchAndSortValues.ascending}
        />
      </div>
    </div>
  )
}

export { ActionButtons }
