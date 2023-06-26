import { Text } from '@status-im/components'

import { TableIssues } from '@/components/table-issues'
import { InsightsLayout } from '@/layouts/insights-layout'
import { api } from '@/lib/graphql'
import { useGetOrphansQuery } from '@/lib/graphql/generated/hooks'

import type {
  GetOrphansQuery,
  GetOrphansQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { Page } from 'next'

const GET_ORPHANS = /* GraphQL */ `
  query getOrphans {
    gh_orphans {
      labels
      assignee
      author
      issue_number
      closed_at
      repository
      stage
      title
    }
  }
`

type Props = {
  orphans: GetOrphansQuery
}

const OrphansPage: Page<Props> = props => {
  const { data, isLoading } = useGetOrphansQuery(undefined, {
    initialData: props.orphans,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const orphans = data?.gh_orphans || []

  return (
    <div className="space-y-6 p-10">
      <Text size={27} weight="semibold">
        Orphans
      </Text>

      <TableIssues data={orphans} />
    </div>
  )
}

OrphansPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export async function getStaticProps() {
  const result = await api<GetOrphansQuery, GetOrphansQueryVariables>(
    GET_ORPHANS,
    undefined
  )

  return { props: { repos: result.gh_orphans || [] } }
}

export default OrphansPage
