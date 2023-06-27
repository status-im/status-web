import { useEffect, useRef } from 'react'

import { useInfiniteQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { Breadcrumbs } from '@/components'
import { EpicOverview } from '@/components/epic-overview'
import { TableIssues } from '@/components/table-issues'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { InsightsLayout } from '@/layouts/insights-layout'
import { api } from '@/lib/graphql'

import type {
  GetBurnupQuery,
  GetBurnupQueryVariables,
  GetEpicIssuesCountQuery,
  GetEpicIssuesCountQueryVariables,
  GetIssuesByEpicQuery,
  GetIssuesByEpicQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { GetServerSidePropsContext, Page } from 'next'

const GET_BURNUP = /* GraphQL */ `
  query getBurnup($epicName: String!) {
    gh_burnup(
      where: { epic_name: { _eq: $epicName } }
      order_by: { date_field: asc }
    ) {
      author
      assignee
      cumulative_closed_issues
      cumulative_opened_issues
      date_field
      epic_name
      epic_color
      repository
    }
  }
`

const GET_ISSUES_BY_EPIC = /* GraphQL */ `
  query getIssuesByEpic($epicName: String!, $limit: Int!, $offset: Int!) {
    gh_epic_issues(
      where: { epic_name: { _eq: $epicName } }
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

type Props = {
  burnup: GetBurnupQuery['gh_burnup']
  count: {
    total: number
    closed: number
    open: number
  }
}

const LIMIT = 10

const EpicsDetailPage: Page<Props> = props => {
  const router = useRouter()

  const { epic: epicName } = router.query

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      ['getIssuesByEpic', epicName],
      async ({ pageParam = 0 }) => {
        const result = await api<
          GetIssuesByEpicQuery,
          GetIssuesByEpicQueryVariables
        >(GET_ISSUES_BY_EPIC, {
          epicName: epicName as string,
          limit: LIMIT,
          offset: pageParam,
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
      <div className="px-10 py-6">
        <EpicOverview
          title="Communities protocol"
          description="Detecting keycard reader removal for the beginning of each flow"
          fullscreen
          burnup={burnup}
        />
        <div role="separator" className="-mx-6 my-6 h-px bg-neutral-10" />
        <TableIssues
          data={issues}
          count={props.count}
          isLoading={isFetchingNextPage}
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
    }
  )

  const resultIssuesCount = await api<
    GetEpicIssuesCountQuery,
    GetEpicIssuesCountQueryVariables
  >(GET_EPIC_ISSUES_COUNT, {
    epicName: String(epic),
  })

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
    },
  }
}

export default EpicsDetailPage
