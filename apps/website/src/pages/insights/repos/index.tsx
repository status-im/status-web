import { Shadow, Text } from '@status-im/components'
import { OpenIcon, UnlockedIcon } from '@status-im/icons'

import { Link } from '@/components/link'
import { InsightsLayout } from '@/layouts/insights-layout'
import { GET_EPIC_LINKS, GET_REPOS } from '@/lib/burnup'
import { api } from '@/lib/graphql'
import { useGetRepositoriesQuery } from '@/lib/graphql/generated/hooks'

import { LoadingSkeleton } from './loading-skeleton'

import type {
  GetEpicMenuLinksQuery,
  GetEpicMenuLinksQueryVariables,
  GetRepositoriesQuery,
  GetRepositoriesQueryVariables,
} from '@/lib/graphql/generated/operations'
import type { Page } from 'next'

type Props = {
  repos: GetRepositoriesQuery
  links: string[]
}

const capitalizeString = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

const ReposPage: Page<Props> = props => {
  const { data, isLoading } = useGetRepositoriesQuery(undefined, {
    initialData: props.repos,
  })

  if (isLoading) {
    return <LoadingSkeleton />
  }

  const repos = data?.gh_repositories || []

  return (
    <InsightsLayout links={props.links}>
      <div className="p-10">
        <div className="mb-6">
          <Text size={27} weight="semibold">
            Repos
          </Text>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {repos.map(repo => (
            <Shadow key={repo.name}>
              <Link
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
                  <div className="flex items-center">
                    <div className="pr-1">
                      <UnlockedIcon size={12} color="$neutral-50" />
                    </div>
                    <Text size={13} weight="medium" color="$neutral-100">
                      {repo.visibility && capitalizeString(repo.visibility)}
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <div className="pr-1">
                      <OpenIcon size={12} color="$neutral-50" />
                    </div>
                    <Text size={13} weight="medium" color="$neutral-50">
                      {repo.open_issues_count} Issues
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <div className="pr-1">
                      <OpenIcon size={12} color="$neutral-50" />
                    </div>
                    <Text size={13} weight="medium" color="$neutral-50">
                      {repo.stargazers_count} Stars
                    </Text>
                  </div>
                </div>
              </Link>
            </Shadow>
          ))}
        </div>
      </div>
    </InsightsLayout>
  )
}

export async function getServerSideProps() {
  const result = await api<GetRepositoriesQuery, GetRepositoriesQueryVariables>(
    GET_REPOS,
    undefined
  )

  const links = await api<
    GetEpicMenuLinksQuery,
    GetEpicMenuLinksQueryVariables
  >(GET_EPIC_LINKS)

  return {
    props: {
      links:
        links?.gh_epics
          .filter(epic => epic.status === 'In Progress')
          .map(epic => epic.epic_name) || [],
      repos: result.gh_repositories || [],
    },
  }
}

export default ReposPage
