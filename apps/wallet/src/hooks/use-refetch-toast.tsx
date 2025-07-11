import { useEffect, useRef } from 'react'

import { useToast } from '@status-im/components'
import { RefreshIcon } from '@status-im/icons/20'
import { useIsFetching } from '@tanstack/react-query'

interface UseRefetchToastOptions {
  isRefreshing: boolean
  queryKeys?: string[][]
}

export function useRefetchToast({
  isRefreshing,
  queryKeys,
}: UseRefetchToastOptions) {
  const toast = useToast()
  const hasShownLoadingToast = useRef(false)
  const hasShownSuccessToast = useRef(false)

  const fetchingCount = useIsFetching(
    queryKeys
      ? {
          predicate: query =>
            queryKeys.some(
              key =>
                query.queryKey.length >= key.length &&
                key.every((k, index) => query.queryKey[index] === k),
            ),
        }
      : undefined,
  )

  useEffect(() => {
    if (!isRefreshing) {
      hasShownLoadingToast.current = false
      hasShownSuccessToast.current = false
      return
    }

    if (fetchingCount > 0 && !hasShownLoadingToast.current) {
      hasShownLoadingToast.current = true
      toast.custom(
        'Refreshing prices and balances',
        <RefreshIcon style={{ animation: 'spin 1s linear infinite' }} />,
      )
    }

    if (
      fetchingCount === 0 &&
      hasShownLoadingToast.current &&
      !hasShownSuccessToast.current
    ) {
      hasShownSuccessToast.current = true
      toast.positive('Prices and balances have been updated')
    }
  }, [fetchingCount, isRefreshing, toast])
}
