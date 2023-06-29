import { useEffect, useMemo, useRef, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { useRouter } from 'next/router'

import { Breadcrumbs, EpicOverview, TableIssues } from '@/components'
import { useDebounce } from '@/hooks/use-debounce'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { InsightsLayout } from '@/layouts/insights-layout'
import {
  GET_BURNUP,
  GET_EPIC_ISSUES_COUNT,
  GET_EPIC_LINKS,
  GET_FILTERS_WITH_EPIC,
  GET_ISSUES_BY_EPIC,
} from '@/lib/burnup'
import { api } from '@/lib/graphql'
import {
  useGetBurnupQuery,
  useGetEpicIssuesCountQuery,
  useGetFiltersWithEpicQuery,
} from '@/lib/graphql/generated/hooks'
import { Order_By } from '@/lib/graphql/generated/schemas'

import type { BreadcrumbsProps } from '@/components/breadcrumbs'
import type {
  GetBurnupQuery,
  GetBurnupQueryVariables,
  GetEpicIssuesCountQuery,
  GetEpicIssuesCountQueryVariables,
  GetEpicMenuLinksQuery,
  GetEpicMenuLinksQueryVariables,
  GetFiltersWithEpicQuery,
  GetFiltersWithEpicQueryVariables,
  GetIssuesByEpicQuery,
  GetIssuesByEpicQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { DateRange } from '@status-im/components/src/calendar/calendar'
import type { GetServerSidePropsContext, Page } from 'next'

type Epic = {
  title: string
  color: `#${string}`
  description: string
}

type Props = {
  links: string[]
  epic: Epic
  breadcrumbs: BreadcrumbsProps['items']
  burnup: GetBurnupQuery
  count: GetEpicIssuesCountQuery
  filters: GetFiltersWithEpicQuery
  initialDates: {
    from: string
    to: string
  }
}

const LIMIT = 10

const EpicsDetailPage: Page<Props> = props => {
  const router = useRouter()

  const { epic: epicName } = router.query

  const { epic, breadcrumbs, links, initialDates } = props

  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Desc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

  const [selectedDates, setSelectedDates] = useState<DateRange>()

  const { data: dataBurnup, isFetching: isLoadingBurnup } = useGetBurnupQuery(
    {
      epicNames: epicName,
      from: selectedDates?.from || initialDates.from,
      to: selectedDates?.to || initialDates.to,
    },
    {
      // Prevent animation if we go out of the page
      refetchOnWindowFocus: false,
      initialData: props.burnup,
    }
  )

  const { data: dataCounter } = useGetEpicIssuesCountQuery({
    where: {
      epic_name: { _eq: epicName as string },
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
    total: dataCounter?.gh_epic_issues.length,
    closed: dataCounter?.gh_epic_issues.filter(issue => issue.closed_at).length,
    open: dataCounter?.gh_epic_issues.filter(issue => !issue.closed_at).length,
  }

  const burnup = dataBurnup?.gh_burnup || []

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [
        'getIssuesByEpic',
        epicName,
        activeTab,
        selectedAssignees,
        selectedRepos,
        selectedAuthors,
        orderByValue,
        debouncedSearchFilter,
      ],
      async ({ pageParam = 0 }) => {
        const result = await api<
          GetIssuesByEpicQuery,
          GetIssuesByEpicQueryVariables
        >(GET_ISSUES_BY_EPIC, {
          where: {
            epic_name: { _eq: epicName as string },
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
        })

        return result?.gh_epic_issues || []
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

  const { data: filters } = useGetFiltersWithEpicQuery(
    {
      epicName: epicName as string,
    },
    {
      initialData: props.filters,
    }
  )

  const issues = useMemo(
    () => data?.pages.flatMap(page => page) || [],
    [data?.pages]
  )

  const endOfPageRef = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(endOfPageRef, {
    rootMargin: '800px',
  })
  const isVisible = !!entry?.isIntersecting

  useEffect(() => {
    if (isVisible && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  return (
    <InsightsLayout links={links}>
      <Breadcrumbs items={breadcrumbs} />
      <div className="px-10 py-6">
        <EpicOverview
          title={epic.title}
          description={epic.description}
          color={epic.color}
          fullscreen
          burnup={burnup}
          isLoading={isLoadingBurnup}
          selectedDates={selectedDates}
          setSelectedDates={setSelectedDates}
        />
      </div>
      <div className="border-neutral-10 px-10 py-6">
        <TableIssues
          data={issues}
          count={count}
          isLoading={isFetchingNextPage || isFetching || hasNextPage}
          filters={filters}
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

export default EpicsDetailPage

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { epic } = context.query

  const links = await api<
    GetEpicMenuLinksQuery,
    GetEpicMenuLinksQueryVariables
  >(GET_EPIC_LINKS)

  const epicLinkExists = links?.gh_epics.find(link => link.epic_name === epic)

  if (!epicLinkExists) {
    return {
      redirect: { destination: '/insights/epics', permanent: false },
    }
  }

  // TODO: get initial date based on the epic when available
  const initialDates = {
    from: '2017-01-01',
    to: format(new Date(), 'yyyy-MM-dd'),
  }

  const [resultBurnup, resultIssuesCount, resultFilters] = await Promise.all([
    api<GetBurnupQuery, GetBurnupQueryVariables>(GET_BURNUP, {
      epicNames: String(epic),
      from: initialDates.from,
      to: initialDates.to,
    }),
    api<GetEpicIssuesCountQuery, GetEpicIssuesCountQueryVariables>(
      GET_EPIC_ISSUES_COUNT,
      {
        where: {
          epic_name: { _eq: String(epic) },
        },
      }
    ),
    api<GetFiltersWithEpicQuery, GetFiltersWithEpicQueryVariables>(
      GET_FILTERS_WITH_EPIC,
      {
        epicName: String(epic),
      }
    ),
  ])

  return {
    props: {
      links:
        links?.gh_epics
          .filter(epic => epic.status === 'In Progress')
          .map(epic => epic.epic_name) || [],
      burnup: resultBurnup?.gh_burnup || [],
      count: resultIssuesCount?.gh_epic_issues,
      filters: resultFilters || [],
      initialDates,
      epic: {
        title: String(epic),
        description: epicLinkExists?.epic_description || '',
        color: epicLinkExists.epic_color
          ? `#${epicLinkExists.epic_color}`
          : '#4360df',
      },
      breadcrumbs: [
        {
          label: 'Epics',
          href: '/insights/epics',
        },
        {
          label: epic,
          href: `/insights/epics/${epic}`,
        },
      ],
      key: epic,
    },
  }
}
