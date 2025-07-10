'use client'

import { useEffect, useRef } from 'react'

import { useIntersectionObserver } from './use-intersection-observer'

type Props = {
  rootMargin: string
  fetchNextPage: () => void
  isFetchingNextPage: boolean
  hasNextPage?: boolean
}

const useInfiniteLoading = (props: Props) => {
  const { rootMargin, fetchNextPage, isFetchingNextPage, hasNextPage } = props

  const endOfPageRef = useRef<HTMLDivElement>(null)
  const entry = useIntersectionObserver(endOfPageRef, {
    rootMargin,
    threshold: 0.1,
  })

  const isVisible = !!entry?.isIntersecting
  const isLoading = isFetchingNextPage

  useEffect(() => {
    const shouldFetch = isVisible && hasNextPage && !isFetchingNextPage

    if (shouldFetch) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  return {
    endOfPageRef,
    isLoading,
  }
}

export { useInfiniteLoading }
