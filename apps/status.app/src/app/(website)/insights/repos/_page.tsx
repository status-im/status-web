'use client'

import { Skeleton, Text } from '@status-im/components'
import { OpenStateIcon, UnlockedIcon } from '@status-im/icons/12'

import { capitalizeFirstLetter } from '~app/_utils/capitalize-first-letter'
import { Link } from '~components/link'
import { useGetRepositoriesQuery } from '~website/insights/_graphql/generated/hooks'

export default function ReposPage() {
  const { data, isLoading } = useGetRepositoriesQuery(undefined, {})

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-10">
        <Skeleton height={20} width={120} className="rounded-6" />

        <div className="grid grid-cols-3 gap-5">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="shadow-1">
              <div className="flex h-[124px] flex-col justify-between rounded-16 border border-neutral-10 px-4 py-3">
                <Skeleton height={12} width={120} className="rounded-6" />
                <Skeleton height={12} width={220} className="rounded-6" />
                <div className="flex flex-row items-center gap-3">
                  <Skeleton
                    height={12}
                    width={40}
                    className="rounded-6"
                    variant="secondary"
                  />
                  <Skeleton
                    height={12}
                    width={40}
                    className="rounded-6"
                    variant="secondary"
                  />
                  <Skeleton
                    height={12}
                    width={40}
                    className="rounded-6"
                    variant="secondary"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
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
            className="flex h-[124px] flex-col justify-between rounded-16 border border-neutral-10 px-4 py-3 shadow-1 transition-all hover:scale-[101%] hover:shadow-3"
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
                  <UnlockedIcon className="text-neutral-50" />
                </div>
                <Text size={13} weight="medium" color="$neutral-100">
                  {repo.visibility && capitalizeFirstLetter(repo.visibility)}
                </Text>
              </div>
              <div className="flex items-center">
                <div className="pr-1">
                  <OpenStateIcon className="text-neutral-50" />
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
                    <g clipPath="url(#clip0_3507_951)">
                      <path
                        d="M6.00004 1C6.33333 1 7.66667 4.32285 7.66667 4.32285C7.66667 4.32285 11 4.32285 11 4.7382C11 5.15356 8.08333 7.23033 8.08333 7.23033C8.08333 7.23033 9.66667 10.6363 9.33333 10.9685C9 11.3008 6.00004 8.89176 6.00004 8.89176C6.00004 8.89176 3 11.3008 2.66667 10.9685C2.33333 10.6363 3.91667 7.23033 3.91667 7.23033C3.91667 7.23033 1 5.15356 1 4.7382C1 4.32285 4.33333 4.32285 4.33333 4.32285C4.33333 4.32285 5.66674 1 6.00004 1Z"
                        stroke="#647084"
                        strokeWidth="1.1"
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
        ))}
      </div>
    </div>
  )
}
