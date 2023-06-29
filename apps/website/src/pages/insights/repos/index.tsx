import { Shadow, Text } from '@status-im/components'
import { OpenIcon, UnlockedIcon } from '@status-im/icons'

import { Link } from '@/components/link'
import { LoadingSkeleton } from '@/components/repos/loading-skeleton'
import { InsightsLayout } from '@/layouts/insights-layout'
import { GET_EPIC_LINKS, GET_REPOS } from '@/lib/burnup'
import { api } from '@/lib/graphql'
import { useGetRepositoriesQuery } from '@/lib/graphql/generated/hooks'

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
                    <Text size={13} weight="medium" color="$neutral-100">
                      {repo.open_issues_count} Issues
                    </Text>
                  </div>
                  <div className="flex items-center">
                    <div className="pr-1">
                      {/* TODO Change the correct star icon when available */}
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_3507_951)">
                          <path
                            d="M6.00004 1C6.33333 1 7.66667 4.32285 7.66667 4.32285C7.66667 4.32285 11 4.32285 11 4.7382C11 5.15356 8.08333 7.23033 8.08333 7.23033C8.08333 7.23033 9.66667 10.6363 9.33333 10.9685C9 11.3008 6.00004 8.89176 6.00004 8.89176C6.00004 8.89176 3 11.3008 2.66667 10.9685C2.33333 10.6363 3.91667 7.23033 3.91667 7.23033C3.91667 7.23033 1 5.15356 1 4.7382C1 4.32285 4.33333 4.32285 4.33333 4.32285C4.33333 4.32285 5.66674 1 6.00004 1Z"
                            stroke="#647084"
                            stroke-width="1.1"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_3507_951">
                            <rect width="12" height="12" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                    <Text size={13} weight="medium" color="$neutral-100">
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
