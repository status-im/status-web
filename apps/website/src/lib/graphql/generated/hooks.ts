import { useQuery } from '@tanstack/react-query'

import { createFetcher } from '../api'

import type * as Types from './operations'
import type { UseQueryOptions } from '@tanstack/react-query'

export const GetRepositoriesDocument = `
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
export const useGetRepositoriesQuery = <
  TData = Types.GetRepositoriesQuery,
  TError = GraphqlApiError
>(
  variables?: Types.GetRepositoriesQueryVariables,
  options?: UseQueryOptions<Types.GetRepositoriesQuery, TError, TData>
) =>
  useQuery<Types.GetRepositoriesQuery, TError, TData>(
    variables === undefined
      ? ['getRepositories']
      : ['getRepositories', variables],
    createFetcher<
      Types.GetRepositoriesQuery,
      Types.GetRepositoriesQueryVariables
    >(GetRepositoriesDocument, variables),
    options
  )

useGetRepositoriesQuery.getKey = (
  variables?: Types.GetRepositoriesQueryVariables
) =>
  variables === undefined ? ['getRepositories'] : ['getRepositories', variables]
