import { useEffect, useMemo, useRef, useState } from 'react'

import { Text } from '@status-im/components'
import { useInfiniteQuery } from '@tanstack/react-query'

import { TableIssues } from '@/components'
import { useDebounce } from '@/hooks/use-debounce'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { InsightsLayout } from '@/layouts/insights-layout'
import {
  GET_EPIC_LINKS,
  GET_FILTERS_FOR_ORPHANS,
  GET_ORPHANS,
  GET_ORPHANS_COUNT,
} from '@/lib/burnup'
import { api } from '@/lib/graphql'
import { useGetOrphansCountQuery } from '@/lib/graphql/generated/hooks'
import { Order_By } from '@/lib/graphql/generated/schemas'

import type {
  GetEpicMenuLinksQuery,
  GetEpicMenuLinksQueryVariables,
  GetFiltersForOrphansQuery,
  GetFiltersForOrphansQueryVariables,
  GetOrphansCountQuery,
  GetOrphansCountQueryVariables,
  GetOrphansQuery,
  GetOrphansQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { Page } from 'next'

type Props = {
  orphans: GetOrphansQuery
  filters: GetFiltersForOrphansQuery
  links: string[]
}

const LIMIT = 50

const OrphansPage: Page<Props> = props => {
  const { links } = props

  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Desc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [
        'getOrphans',
        activeTab,
        selectedAssignees,
        selectedRepos,
        selectedAuthors,
        orderByValue,
        debouncedSearchFilter,
      ],
      async ({ pageParam = 0 }) => {
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
      {
        getNextPageParam: (lastPage, pages) => {
          if (lastPage.length < LIMIT) {
            return undefined
          }

          return pages.length * LIMIT
        },
      }
    )

  const { data: dataCounter } = useGetOrphansCountQuery({
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
    <InsightsLayout links={links}>
      <div className="space-y-6 scroll-smooth p-10">
        <Text size={27} weight="semibold">
          Orphans
        </Text>
        <TableIssues
          data={orphans}
          count={count}
          isLoading={isFetchingNextPage || isFetching || hasNextPage}
          filters={props.filters}
          handleTabChange={setActiveTab}
          activeTab={activeTab}
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
    </InsightsLayout>
  )
}

export async function getServerSideProps() {
  const [links, repos, filters, resultIssuesCount] = await Promise.all([
    api<GetEpicMenuLinksQuery, GetEpicMenuLinksQueryVariables>(GET_EPIC_LINKS),
    api<GetOrphansQuery, GetOrphansQueryVariables>(GET_ORPHANS, {
      where: {
        stage: { _eq: 'open' },
      },
      limit: LIMIT,
      offset: 0,
      orderBy: Order_By.Desc,
    }),
    api<GetFiltersForOrphansQuery, GetFiltersForOrphansQueryVariables>(
      GET_FILTERS_FOR_ORPHANS
    ),
    api<GetOrphansCountQuery, GetOrphansCountQueryVariables>(
      GET_ORPHANS_COUNT,
      {
        where: {
          stage: { _eq: 'open' },
        },
      }
    ),
  ])

  return {
    props: {
      links:
        links?.gh_epics
          .filter(epic => epic.status === 'In Progress')
          .map(epic => epic.epic_name) || [],
      repos: repos.gh_orphans || [],
      filters,
      count: resultIssuesCount,
    },
  }
}

export default OrphansPage
