import { Text } from '@status-im/components'

import { Link } from '@/components/link'
import { InsightsLayout } from '@/layouts/insights-layout'
import { api } from '@/lib/graphql'
import { useGetRepositoriesQuery } from '@/lib/graphql/generated/hooks'

import type {
  GetRepositoriesQuery,
  GetRepositoriesQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { Page } from 'next'

const GET_REPOS = /* GraphQL */ `
  query getRepositories {
    gh_repositories {
      description
      full_name
      name
      open_issues_count
      stargazers_count
      visibility
    }
  }
`

type Props = {
  repos: GetRepositoriesQuery
}

const ReposPage: Page<Props> = props => {
  const { data, isLoading } = useGetRepositoriesQuery(undefined, {
    initialData: props.repos,
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  const repos = data?.gh_repositories || []

  return (
    <div className="p-10">
      <div className="mb-6">
        <Text size={27} weight="semibold">
          Repos
        </Text>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {repos.map(repo => (
          <Link
            key={repo.name}
            href={`https://github.com/status-im/${repo.name}`}
            className="flex h-[124px] flex-col justify-between rounded-2xl border border-neutral-10 px-4 py-3 transition-colors duration-200 hover:border-neutral-40"
          >
            <div className="flex flex-col">
              <Text size={15} weight="semibold">
                {repo.name}
              </Text>
              <Text size={15} color="$neutral-50" truncate>
                {repo.description}
              </Text>
            </div>

            <div className="flex gap-3 pt-4">
              <Text size={13} weight="medium" color="$neutral-50">
                {repo.visibility}
              </Text>
              <Text size={13} weight="medium" color="$neutral-50">
                {repo.open_issues_count} Issues
              </Text>
              <Text size={13} weight="medium" color="$neutral-50">
                {repo.stargazers_count} Stars
              </Text>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

ReposPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export async function getStaticProps() {
  const result = await api<GetRepositoriesQuery, GetRepositoriesQueryVariables>(
    GET_REPOS,
    undefined
  )

  return { props: { repos: result.gh_repositories || [] } }
}

export default ReposPage
