import { useEffect, useRef, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { Breadcrumbs, EpicOverview, TableIssues } from '@/components'
import { useDebounce } from '@/hooks/use-debounce'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { InsightsLayout } from '@/layouts/insights-layout'
import { api } from '@/lib/graphql'
import {
  useGetEpicIssuesCountQuery,
  useGetFiltersQuery,
} from '@/lib/graphql/generated/hooks'
import { Order_By } from '@/lib/graphql/generated/schemas'

import type {
  GetBurnupQuery,
  GetBurnupQueryVariables,
  GetEpicIssuesCountQuery,
  GetEpicIssuesCountQueryVariables,
  GetFiltersQuery,
  GetFiltersQueryVariables,
  GetIssuesByEpicQuery,
  GetIssuesByEpicQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { GetServerSidePropsContext, Page } from 'next'

const GET_BURNUP = /* GraphQL */ `
  query getBurnup($epicName: String!, $startDate: timestamptz) {
    gh_burnup(
      where: { epic_name: { _eq: $epicName }, date_field: { _gte: $startDate } }
      order_by: { date_field: asc }
    ) {
      epic_name
      total_closed_issues
      total_opened_issues
      date_field
    }
  }
`

const GET_ISSUES_BY_EPIC = /* GraphQL */ `
  query getIssuesByEpic(
    $where: gh_epic_issues_bool_exp!
    $limit: Int!
    $offset: Int!
    $orderBy: order_by
  ) {
    gh_epic_issues(
      where: $where
      order_by: { created_at: $orderBy }
      limit: $limit
      offset: $offset
    ) {
      assignee
      author
      closed_at
      created_at
      epic_color
      epic_name
      repository
      stage
      title
      issue_number
      issue_url
    }
  }
`

const GET_EPIC_ISSUES_COUNT = /* GraphQL */ `
  query getEpicIssuesCount($where: gh_epic_issues_bool_exp!) {
    gh_epic_issues(where: $where) {
      closed_at
    }
  }
`

const GET_FILTERS = /* GraphQL */ `
  query getFilters($epicName: String!) {
    authors: gh_epic_issues(
      where: { epic_name: { _eq: $epicName }, author: { _is_null: false } }
      distinct_on: author
    ) {
      author
    }
    assignees: gh_epic_issues(
      where: { epic_name: { _eq: $epicName }, assignee: { _is_null: false } }
      distinct_on: assignee
    ) {
      assignee
    }
    repos: gh_epic_issues(
      where: { epic_name: { _eq: $epicName } }
      distinct_on: repository
    ) {
      repository
    }
  }
`

type Props = {
  burnup: GetBurnupQuery['gh_burnup']
  count: GetEpicIssuesCountQuery
  filters: GetFiltersQuery
}

const LIMIT = 10

const EpicsDetailPage: Page<Props> = props => {
  const router = useRouter()

  const { epic: epicName } = router.query

  const [activeTab, setActiveTab] = useState<'open' | 'closed'>('open')
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedRepos, setSelectedRepos] = useState<string[]>([])
  const [orderByValue, setOrderByValue] = useState<Order_By>(Order_By.Desc)

  const [searchFilter, setSearchFilter] = useState<string>('')
  const debouncedSearchFilter = useDebounce<string>(searchFilter)

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

  const { data: filters } = useGetFiltersQuery(
    {
      epicName: epicName as string,
    },
    {
      initialData: props.filters,
    }
  )

  const burnup = props.burnup || []

  const issues =
    data?.pages.reduce((acc, page) => {
      return [...acc, ...page]
    }, []) || []

  const endOfPageRef = useRef<HTMLDivElement | null>(null)
  const entry = useIntersectionObserver(endOfPageRef, {})
  const isVisible = !!entry?.isIntersecting

  useEffect(() => {
    if (isVisible && !isFetchingNextPage && hasNextPage) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isVisible])

  return (
    <div>
      <div className="border-b border-neutral-10 px-5 py-3">
        <Breadcrumbs />
      </div>
      <div className="border-b border-neutral-10 px-10 py-6">
        <EpicOverview
          title="Communities protocol"
          description="Detecting keycard reader removal for the beginning of each flow"
          fullscreen
          burnup={burnup}
        />
      </div>
      <div className="border-b border-neutral-10 px-10 py-6">
        <TableIssues
          data={issues}
          count={count}
          isLoading={isFetchingNextPage || isFetching}
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
    </div>
  )
}

EpicsDetailPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { epic } = context.query

  const result = await api<GetBurnupQuery, GetBurnupQueryVariables>(
    GET_BURNUP,
    {
      epicName: String(epic),
      startDate: '2017-01-01',
    }
  )

  const resultIssuesCount = await api<
    GetEpicIssuesCountQuery,
    GetEpicIssuesCountQueryVariables
  >(GET_EPIC_ISSUES_COUNT, {
    where: {
      epic_name: { _eq: String(epic) },
    },
  })

  const resultFilters = await api<GetFiltersQuery, GetFiltersQueryVariables>(
    GET_FILTERS,
    {
      epicName: String(epic),
    }
  )

  return {
    props: {
      burnup: result.gh_burnup || [],
      count: resultIssuesCount,
      filters: resultFilters,
      key: epic,
    },
  }
}

export default EpicsDetailPage
