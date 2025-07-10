import { useCallback, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useRefetchToast } from './use-refetch-toast'

const REFRESH_INTERVAL_MS = 15 * 1000
const REFRESH_COMPLETE_DELAY_MS = 50

export function useSynchronizedRefetch(address: string) {
  const queryClient = useQueryClient()
  const [isWindowActive, setIsWindowActive] = useState(true)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)

  const refetchQueries = useCallback(async () => {
    if (!address) return

    setIsAutoRefreshing(true)

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

    setTimeout(() => setIsAutoRefreshing(false), REFRESH_COMPLETE_DELAY_MS)
  }, [address, queryClient])

  useRefetchToast({
    isRefreshing: isAutoRefreshing,
    queryKeys: address
      ? [
          ['assets', address],
          ['collectibles', address],
          ['activities', address],
          ['collectible'],
          ['token'],
        ]
      : [],
  })

  useEffect(() => {
    const handleVisibilityChange = () => {
      const isNowActive = !document.hidden
      setIsWindowActive(isNowActive)

      if (isNowActive) {
        refetchQueries()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [address, queryClient, refetchQueries])

  useEffect(() => {
    if (!isWindowActive) return

    const interval = setInterval(refetchQueries, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isWindowActive, address, queryClient, refetchQueries])
}
