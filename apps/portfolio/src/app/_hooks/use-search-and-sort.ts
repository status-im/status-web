'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { match, P } from 'ts-pattern'

import { DEFAULT_SORT, SORT_OPTIONS } from '../_constants'

type UseSearchAndSortReturn = {
  inputValue: string
  updateSearchParam: (value: string) => void
  orderByColumn: string
  ascending: boolean
  onOrderByChange: (column: string | number, isAscending: boolean) => void
  clearSearch: () => void
  sortOptions: Record<string, string>
}

const checkPageType = (pathname: string): 'assets' | 'collectibles' => {
  const result = match(pathname)
    .with(P.string.includes('/assets'), () => 'assets')
    .with(P.string.includes('/collectibles'), () => 'collectibles')
    .otherwise(() => 'assets') as 'assets'

  return result
}

const useSearchAndSort = (): UseSearchAndSortReturn => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  const pageType = checkPageType(pathname)
  const allowedSortOptions = SORT_OPTIONS[pageType]
  const defaultSort = DEFAULT_SORT[pageType]

  const searchParamValue = searchParams.get('search') ?? ''
  const sortParamValue = searchParams.get('sort')

  const [inputValue, setInputValue] = useState(searchParamValue)

  let [orderByColumn, sortDirection] = sortParamValue?.split(',') ?? [
    defaultSort.column,
    defaultSort.direction,
  ]

  if (sortParamValue && !(orderByColumn in allowedSortOptions)) {
    orderByColumn = defaultSort.column
    sortDirection = defaultSort.direction
  }

  const ascending = sortDirection === 'asc'

  useEffect(() => {
    setInputValue(searchParamValue)
  }, [pathname, searchParamValue])

  const updateSearchParam = useCallback(
    (value: string) => {
      setInputValue(value)
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
      debounceTimerRef.current = setTimeout(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
          params.set('search', value)
        } else {
          params.delete('search')
        }
        router.push(`${pathname}?${params.toString()}`, { scroll: false })
      }, 300)
    },
    [pathname, router, searchParams]
  )

  const clearSearch = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('search')
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current)
    }
  }, [])

  const onOrderByChange = useCallback(
    (column: string | number, isAscending: boolean) => {
      const params = new URLSearchParams(searchParams.toString())
      const direction = isAscending ? 'asc' : 'desc'
      params.set('sort', `${column},${direction}`)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams]
  )

  return {
    inputValue,
    updateSearchParam,
    orderByColumn: sortParamValue ? orderByColumn : defaultSort.column,
    ascending: sortParamValue ? ascending : defaultSort.direction === 'asc',
    onOrderByChange,
    sortOptions: allowedSortOptions,
    clearSearch,
  }
}

export { useSearchAndSort }
