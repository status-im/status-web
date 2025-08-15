import { useEffect, useRef } from 'react'

import { useToast } from '@status-im/components'
import { RefreshIcon } from '@status-im/icons/20'
import { useIsFetching, useQueryClient } from '@tanstack/react-query'

interface UseRefetchToastOptions {
  isRefreshing: boolean
  queryKeys?: string[][]
  onComplete?: () => void
  showLoadingAndSuccess?: boolean
}

export function useRefetchToast({
  isRefreshing,
  queryKeys,
  onComplete,
  showLoadingAndSuccess = true,
}: UseRefetchToastOptions) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const hasShownLoadingToast = useRef(false)
  const hasShownSuccessToast = useRef(false)
  const hasShownErrorToast = useRef(false)

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

  const hasError = queryKeys
    ? queryClient
        .getQueryCache()
        .getAll()
        .some(
          query =>
            queryKeys.some(
              key =>
                query.queryKey.length >= key.length &&
                key.every((k, index) => query.queryKey[index] === k),
            ) && query.state.status === 'error',
        )
    : false

  useEffect(() => {
    if (!isRefreshing) {
      hasShownLoadingToast.current = false
      hasShownSuccessToast.current = false
      hasShownErrorToast.current = false
      return
    }

    if (fetchingCount > 0 && !hasShownLoadingToast.current) {
      hasShownLoadingToast.current = true
      if (showLoadingAndSuccess) {
        toast.custom(
          'Refreshing prices and balances',
          <RefreshIcon style={{ animation: 'spin 1s linear infinite' }} />,
        )
      }
    }

    if (
      fetchingCount === 0 &&
      hasShownLoadingToast.current &&
      !hasShownSuccessToast.current &&
      !hasError
    ) {
      hasShownSuccessToast.current = true
      if (showLoadingAndSuccess) {
        toast.positive('Prices and balances have been updated')
      }

      if (onComplete) {
        onComplete()
      }
    }

    if (hasError && !hasShownErrorToast.current) {
      hasShownErrorToast.current = true
      toast.negative('Failed to update prices and balances')

      if (onComplete) {
        onComplete()
      }
    }
  }, [fetchingCount, isRefreshing, toast, hasError, onComplete])
}
