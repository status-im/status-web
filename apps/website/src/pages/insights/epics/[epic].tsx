import { useEffect, useRef, useState } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { Breadcrumbs, EpicOverview, TableIssues } from '@/components'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { InsightsLayout } from '@/layouts/insights-layout'
import { api } from '@/lib/graphql'
import { useGetFiltersQuery } from '@/lib/graphql/generated/hooks'

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
    $epicName: String!
    $author: [String!]
    $assignee: [String!]
    $repository: [String!]
    $authorExists: Boolean!
    $assigneeExists: Boolean!
    $repositoryExists: Boolean!
    $state: String!
    $limit: Int!
    $offset: Int!
  ) {
    gh_epic_issues(
      where: {
        epic_name: { _eq: $epicName }
        author: { _in: $author }
        stage: { _eq: $state }
        assignee: { _in: $assignee }
        repository: { _in: $repository }
      }
      order_by: { created_at: desc }
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
  query getEpicIssuesCount($epicName: String!) {
    gh_epic_issues(where: { epic_name: { _eq: $epicName } }) {
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
  count: {
    total: number
    closed: number
    open: number
  }
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

  const { data, isFetching, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      [
        'getIssuesByEpic',
        epicName,
        activeTab,
        selectedAuthors,
        selectedAssignees,
        selectedRepos,
      ],
      async ({ pageParam = 0 }) => {
        const result = await api<
          GetIssuesByEpicQuery,
          GetIssuesByEpicQueryVariables
        >(GET_ISSUES_BY_EPIC, {
          epicName: epicName as string,
          limit: LIMIT,
          offset: pageParam,
          state: activeTab,
          author: selectedAuthors,
          assignee: selectedAssignees,
          repository: selectedRepos,
          assigneeExists: selectedAssignees.length !== 0,
          authorExists: selectedAuthors.length !== 0,
          repositoryExists: selectedRepos.length !== 0,
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
        <div role="separator" className="-mx-6 my-6 h-px bg-neutral-10" />
        <TableIssues
          data={issues}
          count={props.count}
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
    epicName: String(epic),
  })

  const resultFilters = await api<GetFiltersQuery, GetFiltersQueryVariables>(
    GET_FILTERS,
    {
      epicName: String(epic),
    }
  )

  const count = {
    total: resultIssuesCount.gh_epic_issues.length,
    closed: resultIssuesCount.gh_epic_issues.filter(issue => issue.closed_at)
      .length,
    open: resultIssuesCount.gh_epic_issues.filter(issue => !issue.closed_at)
      .length,
  }

  return {
    props: {
      burnup: result.gh_burnup || [],
      count,
      filters: resultFilters,
    },
  }
}

export default EpicsDetailPage
