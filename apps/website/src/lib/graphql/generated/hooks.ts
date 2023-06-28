import { useQuery } from '@tanstack/react-query'

import { createFetcher } from '../api'

import type * as Types from './operations'
import type { UseQueryOptions } from '@tanstack/react-query'

export const GetEpicMenuLinksDocument = `
    query getEpicMenuLinks {
  gh_epics(where: {status: {_eq: "In Progress"}}) {
    epic_name
    status
  }
}
    `
export const useGetEpicMenuLinksQuery = <
  TData = Types.GetEpicMenuLinksQuery,
  TError = GraphqlApiError
>(
  variables?: Types.GetEpicMenuLinksQueryVariables,
  options?: UseQueryOptions<Types.GetEpicMenuLinksQuery, TError, TData>
) =>
  useQuery<Types.GetEpicMenuLinksQuery, TError, TData>(
    variables === undefined
      ? ['getEpicMenuLinks']
      : ['getEpicMenuLinks', variables],
    createFetcher<
      Types.GetEpicMenuLinksQuery,
      Types.GetEpicMenuLinksQueryVariables
    >(GetEpicMenuLinksDocument, variables),
    options
  )

useGetEpicMenuLinksQuery.getKey = (
  variables?: Types.GetEpicMenuLinksQueryVariables
) =>
  variables === undefined
    ? ['getEpicMenuLinks']
    : ['getEpicMenuLinks', variables]
export const GetBurnupDocument = `
    query getBurnup($epicName: String!, $startDate: timestamptz) {
  gh_burnup(
    where: {epic_name: {_eq: $epicName}, date_field: {_gte: $startDate}}
    order_by: {date_field: asc}
  ) {
    epic_name
    total_closed_issues
    total_opened_issues
    date_field
  }
}
    `
export const useGetBurnupQuery = <
  TData = Types.GetBurnupQuery,
  TError = GraphqlApiError
>(
  variables: Types.GetBurnupQueryVariables,
  options?: UseQueryOptions<Types.GetBurnupQuery, TError, TData>
) =>
  useQuery<Types.GetBurnupQuery, TError, TData>(
    ['getBurnup', variables],
    createFetcher<Types.GetBurnupQuery, Types.GetBurnupQueryVariables>(
      GetBurnupDocument,
      variables
    ),
    options
  )

useGetBurnupQuery.getKey = (variables: Types.GetBurnupQueryVariables) => [
  'getBurnup',
  variables,
]
export const GetIssuesByEpicDocument = `
    query getIssuesByEpic($where: gh_epic_issues_bool_exp!, $limit: Int!, $offset: Int!, $orderBy: order_by) {
  gh_epic_issues(
    where: $where
    order_by: {created_at: $orderBy}
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
export const useGetIssuesByEpicQuery = <
  TData = Types.GetIssuesByEpicQuery,
  TError = GraphqlApiError
>(
  variables: Types.GetIssuesByEpicQueryVariables,
  options?: UseQueryOptions<Types.GetIssuesByEpicQuery, TError, TData>
) =>
  useQuery<Types.GetIssuesByEpicQuery, TError, TData>(
    ['getIssuesByEpic', variables],
    createFetcher<
      Types.GetIssuesByEpicQuery,
      Types.GetIssuesByEpicQueryVariables
    >(GetIssuesByEpicDocument, variables),
    options
  )

useGetIssuesByEpicQuery.getKey = (
  variables: Types.GetIssuesByEpicQueryVariables
) => ['getIssuesByEpic', variables]
export const GetEpicIssuesCountDocument = `
    query getEpicIssuesCount($where: gh_epic_issues_bool_exp!) {
  gh_epic_issues(where: $where) {
    closed_at
  }
}
    `
export const useGetEpicIssuesCountQuery = <
  TData = Types.GetEpicIssuesCountQuery,
  TError = GraphqlApiError
>(
  variables: Types.GetEpicIssuesCountQueryVariables,
  options?: UseQueryOptions<Types.GetEpicIssuesCountQuery, TError, TData>
) =>
  useQuery<Types.GetEpicIssuesCountQuery, TError, TData>(
    ['getEpicIssuesCount', variables],
    createFetcher<
      Types.GetEpicIssuesCountQuery,
      Types.GetEpicIssuesCountQueryVariables
    >(GetEpicIssuesCountDocument, variables),
    options
  )

useGetEpicIssuesCountQuery.getKey = (
  variables: Types.GetEpicIssuesCountQueryVariables
) => ['getEpicIssuesCount', variables]
export const GetFiltersDocument = `
    query getFilters($epicName: String!) {
  authors: gh_epic_issues(
    where: {epic_name: {_eq: $epicName}, author: {_is_null: false}}
    distinct_on: author
  ) {
    author
  }
  assignees: gh_epic_issues(
    where: {epic_name: {_eq: $epicName}, assignee: {_is_null: false}}
    distinct_on: assignee
  ) {
    assignee
  }
  repos: gh_epic_issues(
    where: {epic_name: {_eq: $epicName}}
    distinct_on: repository
  ) {
    repository
  }
}
    `
export const useGetFiltersQuery = <
  TData = Types.GetFiltersQuery,
  TError = GraphqlApiError
>(
  variables: Types.GetFiltersQueryVariables,
  options?: UseQueryOptions<Types.GetFiltersQuery, TError, TData>
) =>
  useQuery<Types.GetFiltersQuery, TError, TData>(
    ['getFilters', variables],
    createFetcher<Types.GetFiltersQuery, Types.GetFiltersQueryVariables>(
      GetFiltersDocument,
      variables
    ),
    options
  )

useGetFiltersQuery.getKey = (variables: Types.GetFiltersQueryVariables) => [
  'getFilters',
  variables,
]
export const GetOrphansDocument = `
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
export const useGetOrphansQuery = <
  TData = Types.GetOrphansQuery,
  TError = GraphqlApiError
>(
  variables?: Types.GetOrphansQueryVariables,
  options?: UseQueryOptions<Types.GetOrphansQuery, TError, TData>
) =>
  useQuery<Types.GetOrphansQuery, TError, TData>(
    variables === undefined ? ['getOrphans'] : ['getOrphans', variables],
    createFetcher<Types.GetOrphansQuery, Types.GetOrphansQueryVariables>(
      GetOrphansDocument,
      variables
    ),
    options
  )

useGetOrphansQuery.getKey = (variables?: Types.GetOrphansQueryVariables) =>
  variables === undefined ? ['getOrphans'] : ['getOrphans', variables]
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
