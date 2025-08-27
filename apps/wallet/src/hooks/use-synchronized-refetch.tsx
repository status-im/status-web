import { useCallback, useEffect, useState } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import { useRefetchToast } from './use-refetch-toast'

const REFRESH_INTERVAL_MS = 15 * 1000

export function useSynchronizedRefetch(address: string) {
  const queryClient = useQueryClient()
  const [isWindowActive, setIsWindowActive] = useState(true)
  const [isAutoRefreshing, setIsAutoRefreshing] = useState(false)

  const refetchQueries = useCallback(async () => {
    if (!address) return

    if (has429Error(address, queryClient)) {
      return
    }

    setIsAutoRefreshing(true)

    const queries = queryClient.getQueryCache().getAll()

    const activeQueries = queries.filter(query => {
      const key = query.queryKey
      const hasObservers = query.getObserversCount() > 0

      const hasValidAddress =
        Array.isArray(key) && key[1] && key[1] !== 'undefined'

      const isWalletQuery =
        (Array.isArray(key) && key[0] === 'assets' && key[1] === address) ||
        (Array.isArray(key) &&
          key[0] === 'collectibles' &&
          key[1] === address) ||
        (Array.isArray(key) && key[0] === 'activities' && key[1] === address) ||
        (Array.isArray(key) && key[0] === 'collectible') ||
        (Array.isArray(key) && key[0] === 'token')

      return hasObservers && isWalletQuery && hasValidAddress
    })

    await Promise.all(
      activeQueries.map(async query => {
        await queryClient.invalidateQueries({ queryKey: query.queryKey })
        await queryClient.refetchQueries({
          queryKey: query.queryKey,
          exact: true,
        })
      }),
    )
  }, [address, queryClient])

  useRefetchToast({
    isRefreshing: isAutoRefreshing,
    queryKeys: [
      ['assets', address],
      ['collectibles', address],
      ['activities', address],
      ['collectible'],
      ['token'],
    ],
    showLoadingAndSuccess: false,
    onComplete: () => {
      setIsAutoRefreshing(false)
    },
  })

  useEffect(() => {
    const updateActiveState = () => {
      const isNowActive = document.hasFocus()
      setIsWindowActive(isNowActive)
      if (isNowActive) {
        refetchQueries()
      }
    }
    updateActiveState()

    document.addEventListener('visibilitychange', updateActiveState)
    window.addEventListener('focus', updateActiveState)
    window.addEventListener('blur', updateActiveState)

    return () => {
      document.removeEventListener('visibilitychange', updateActiveState)
      window.removeEventListener('focus', updateActiveState)
      window.removeEventListener('blur', updateActiveState)
    }
  }, [address, queryClient, refetchQueries])

  useEffect(() => {
    if (!isWindowActive) return

    const interval = setInterval(refetchQueries, REFRESH_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isWindowActive, address, queryClient, refetchQueries])
}

function has429Error(
  address: string,
  queryClient: ReturnType<typeof useQueryClient>,
) {
  const queries = queryClient.getQueryCache().getAll()
  return queries.some(query => {
    const key = query.queryKey
    const isRelevant =
      (Array.isArray(key) && key[0] === 'assets' && key[1] === address) ||
      (Array.isArray(key) && key[0] === 'collectibles' && key[1] === address) ||
      (Array.isArray(key) && key[0] === 'activities' && key[1] === address) ||
      (Array.isArray(key) && key[0] === 'collectible') ||
      (Array.isArray(key) && key[0] === 'token')

    if (!isRelevant) {
      return false
    }

    const error = query.state.error

    if (!error) {
      return false
    }

    if (error.cause === 429) {
      return true
    }

    if (typeof error === 'object' && error !== null) {
      if (
        'status' in error &&
        typeof (error as { status?: unknown }).status === 'number' &&
        (error as { status: number }).status === 429
      ) {
        return true
      }

      if (
        'message' in error &&
        typeof (error as { message?: unknown }).message === 'string' &&
        (error as { message: string }).message.includes('429')
      ) {
        return true
      }
    }

    if (typeof error === 'string' && (error as string).includes('429')) {
      return true
    }

    return false
  })
}
