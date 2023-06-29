import { useQuery } from '@tanstack/react-query'

import { createFetcher } from '../api'

import type * as Types from './operations'
import type { UseQueryOptions } from '@tanstack/react-query'

export const GetBurnupDocument = `
    query getBurnup($epicNames: [String!], $from: timestamptz, $to: timestamptz) {
  gh_burnup(
    where: {epic_name: {_in: $epicNames}, _or: [{_and: [{date_field: {_gte: $from}}, {date_field: {_lt: $to}}]}, {_and: [{date_field: {_gt: $from}}, {date_field: {_lte: $to}}]}]}
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
  variables?: Types.GetBurnupQueryVariables,
  options?: UseQueryOptions<Types.GetBurnupQuery, TError, TData>
) =>
  useQuery<Types.GetBurnupQuery, TError, TData>(
    variables === undefined ? ['getBurnup'] : ['getBurnup', variables],
    createFetcher<Types.GetBurnupQuery, Types.GetBurnupQueryVariables>(
      GetBurnupDocument,
      variables
    ),
    options
  )

useGetBurnupQuery.getKey = (variables?: Types.GetBurnupQueryVariables) =>
  variables === undefined ? ['getBurnup'] : ['getBurnup', variables]
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
export const GetFiltersWithEpicDocument = `
    query getFiltersWithEpic($epicName: String!) {
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
export const useGetFiltersWithEpicQuery = <
  TData = Types.GetFiltersWithEpicQuery,
  TError = GraphqlApiError
>(
  variables: Types.GetFiltersWithEpicQueryVariables,
  options?: UseQueryOptions<Types.GetFiltersWithEpicQuery, TError, TData>
) =>
  useQuery<Types.GetFiltersWithEpicQuery, TError, TData>(
    ['getFiltersWithEpic', variables],
    createFetcher<
      Types.GetFiltersWithEpicQuery,
      Types.GetFiltersWithEpicQueryVariables
    >(GetFiltersWithEpicDocument, variables),
    options
  )

useGetFiltersWithEpicQuery.getKey = (
  variables: Types.GetFiltersWithEpicQueryVariables
) => ['getFiltersWithEpic', variables]
export const GetEpicMenuLinksDocument = `
    query getEpicMenuLinks($where: gh_epics_bool_exp, $orderBy: [gh_epics_order_by!], $limit: Int, $offset: Int) {
  gh_epics(
    where: $where
    order_by: $orderBy
    limit: $limit
    offset: $offset
    distinct_on: epic_name
  ) {
    epic_name
    epic_color
    epic_description
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
export const GetOrphansDocument = `
    query getOrphans($where: gh_orphans_bool_exp!, $limit: Int!, $offset: Int!, $orderBy: order_by) {
  gh_orphans(
    where: $where
    order_by: {created_at: $orderBy}
    limit: $limit
    offset: $offset
  ) {
    labels
    assignee
    author
    issue_number
    issue_url
    created_at
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
  variables: Types.GetOrphansQueryVariables,
  options?: UseQueryOptions<Types.GetOrphansQuery, TError, TData>
) =>
  useQuery<Types.GetOrphansQuery, TError, TData>(
    ['getOrphans', variables],
    createFetcher<Types.GetOrphansQuery, Types.GetOrphansQueryVariables>(
      GetOrphansDocument,
      variables
    ),
    options
  )

useGetOrphansQuery.getKey = (variables: Types.GetOrphansQueryVariables) => [
  'getOrphans',
  variables,
]
export const GetOrphansCountDocument = `
    query getOrphansCount($where: gh_orphans_bool_exp!) {
  gh_orphans(where: $where) {
    closed_at
  }
}
    `
export const useGetOrphansCountQuery = <
  TData = Types.GetOrphansCountQuery,
  TError = GraphqlApiError
>(
  variables: Types.GetOrphansCountQueryVariables,
  options?: UseQueryOptions<Types.GetOrphansCountQuery, TError, TData>
) =>
  useQuery<Types.GetOrphansCountQuery, TError, TData>(
    ['getOrphansCount', variables],
    createFetcher<
      Types.GetOrphansCountQuery,
      Types.GetOrphansCountQueryVariables
    >(GetOrphansCountDocument, variables),
    options
  )

useGetOrphansCountQuery.getKey = (
  variables: Types.GetOrphansCountQueryVariables
) => ['getOrphansCount', variables]
export const GetFiltersForOrphansDocument = `
    query getFiltersForOrphans {
  authors: gh_orphans(where: {author: {_is_null: false}}, distinct_on: author) {
    author
  }
  assignees: gh_orphans(
    where: {assignee: {_is_null: false}}
    distinct_on: assignee
  ) {
    assignee
  }
  repos: gh_orphans(distinct_on: repository) {
    repository
  }
}
    `
export const useGetFiltersForOrphansQuery = <
  TData = Types.GetFiltersForOrphansQuery,
  TError = GraphqlApiError
>(
  variables?: Types.GetFiltersForOrphansQueryVariables,
  options?: UseQueryOptions<Types.GetFiltersForOrphansQuery, TError, TData>
) =>
  useQuery<Types.GetFiltersForOrphansQuery, TError, TData>(
    variables === undefined
      ? ['getFiltersForOrphans']
      : ['getFiltersForOrphans', variables],
    createFetcher<
      Types.GetFiltersForOrphansQuery,
      Types.GetFiltersForOrphansQueryVariables
    >(GetFiltersForOrphansDocument, variables),
    options
  )

useGetFiltersForOrphansQuery.getKey = (
  variables?: Types.GetFiltersForOrphansQueryVariables
) =>
  variables === undefined
    ? ['getFiltersForOrphans']
    : ['getFiltersForOrphans', variables]
