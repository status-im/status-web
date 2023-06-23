import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'

import { Breadcrumbs } from '@/components'
import { EpicOverview } from '@/components/epic-overview'
import { TableIssues } from '@/components/table-issues'
import { InsightsLayout } from '@/layouts/insights-layout'
import { fetchQueryFromHasura } from '@/pages/api/hasura'

import type { GetServerSidePropsContext, Page } from 'next'

function getQuery(epicName: string): string {
  return `
    query getBurnup {
      gh_burnup(where: {
        epic_name: {
          _eq: "${epicName}"
        },
      }, order_by: {
        date_field: asc
      }) {
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
}

export type Burnup = {
  assignee: string
  author: string
  cumulative_closed_issues: number
  cumulative_opened_issues: number
  date_field: string
  epic_color: string
  epic_name: string
  repository: string
}

type Props = {
  burnup: Burnup[]
}

const EpicsDetailPage: Page<Props> = props => {
  const router = useRouter()

  const { epic: epicName } = router.query

  const { data, isLoading } = useQuery({
    queryKey: ['getBurnup', epicName],
    queryFn: () => fetchQueryFromHasura(getQuery(String(epicName))),
    initialData: props.burnup,
  })

  const burnup: Burnup[] = data?.data?.gh_burnup || []

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
          isLoading={isLoading}
        />

        <div role="separator" className="-mx-6 my-6 h-px bg-neutral-10" />

        <TableIssues />
      </div>
    </div>
  )
}

EpicsDetailPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { epic } = context.query
  const result = await fetchQueryFromHasura(getQuery(String(epic)))
  return { props: { burnup: result?.data?.gh_burnup || [] } }
}

export default EpicsDetailPage
