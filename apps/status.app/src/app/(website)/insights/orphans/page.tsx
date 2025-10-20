'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'

import { useDebounce } from '~hooks/use-debounce'
import { useIntersectionObserver } from '~hooks/use-intersection-observer'
import { api } from '~website/insights/_graphql'
import {
  useGetFiltersForOrphansQuery,
  useGetOrphansCountQuery,
} from '~website/insights/_graphql/generated/hooks'
import { Order_By } from '~website/insights/_graphql/generated/schemas'

import { TableIssues } from '../_components/table-issues'
import { GET_ORPHANS } from '../_operations'

import type {
  GetOrphansQuery,
  GetOrphansQueryVariables,
} from '~website/insights/_graphql/generated/operations'

const LIMIT = 50

export default function OrphansPage() {
  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Desc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: [
        'getOrphans',
        activeTab,
        selectedAssignees,
        selectedRepos,
        selectedAuthors,
        orderByValue,
        debouncedSearchFilter,
      ],
      queryFn: async ({ pageParam = 0 }) => {
        const result = await api<GetOrphansQuery, GetOrphansQueryVariables>(
          GET_ORPHANS,
          {
            where: {
              stage: { _eq: activeTab },
              ...(selectedAuthors.length > 0 && {
                author: { _in: selectedAuthors },
              }),
              ...(selectedAssignees.length > 0 && {
                assignee: { _in: selectedAssignees },
              }),
              ...(selectedRepos.length > 0 && {
                repository: { _in: selectedRepos },
              }),
              title: { _ilike: `%${debouncedSearchFilter}%` },
            },
            limit: LIMIT,
            offset: pageParam,
            orderBy: orderByValue,
          }
        )

        return result?.gh_orphans || []
      },
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length < LIMIT) {
          return undefined
        }

        return pages.length * LIMIT
      },
      initialPageParam: 0,
    })

  const { data: filters } = useGetFiltersForOrphansQuery()

  const { data: dataCounter, isLoading: isLoadingCount } =
    useGetOrphansCountQuery({
      where: {
        ...(selectedAuthors.length > 0 && {
          author: { _in: selectedAuthors },
        }),
        ...(selectedAssignees.length > 0 && {
          assignee: { _in: selectedAssignees },
        }),
        ...(selectedRepos.length > 0 && {
          repository: { _in: selectedRepos },
        }),
        title: { _ilike: `%${debouncedSearchFilter}%` },
      },
    })

  const count = {
    total: dataCounter?.gh_orphans.length,
    closed: dataCounter?.gh_orphans.filter(issue => issue.closed_at).length,
    open: dataCounter?.gh_orphans.filter(issue => !issue.closed_at).length,
  }

  const orphans = useMemo(
    () => data?.pages.flatMap(page => page) || [],
    [data?.pages]
  )

  const endOfPageRef = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(endOfPageRef, {
    rootMargin: '800px',
    threshold: 0,
  })
  const isVisible = !!entry?.isIntersecting

  useEffect(() => {
    if (isVisible && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  return (
    <div className="space-y-6 scroll-smooth p-10">
      <Text size={27} weight="semibold">
        Orphans
      </Text>
      <TableIssues
        data={orphans}
        count={count}
        isLoadingCount={isLoadingCount}
        isLoading={isFetchingNextPage || isFetching || hasNextPage}
        handleTabChange={setActiveTab}
        activeTab={activeTab}
        filters={filters}
        selectedAuthors={selectedAuthors}
        handleSelectedAuthors={setSelectedAuthors}
        selectedAssignees={selectedAssignees}
        handleSelectedAssignees={setSelectedAssignees}
        selectedRepos={selectedRepos}
        handleSelectedRepos={setSelectedRepos}
        orderByValue={orderByValue}
        handleOrderByValue={setOrderByValue}
        searchFilterValue={searchFilter}
        handleSearchFilter={setSearchFilter}
      />
      <div ref={endOfPageRef} />
    </div>
  )
}
