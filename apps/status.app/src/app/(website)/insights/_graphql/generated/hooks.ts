import { useQuery } from '@tanstack/react-query'

import { createFetcher } from '../api'

import type * as Types from './operations'
import type { UseQueryOptions } from '@tanstack/react-query'

export const GetBurnupPerEpicDocument = `
    query getBurnupPerEpic($epicName: String!, $from: date, $to: date) {
  gh_burnup_per_epic(
    args: {epic_name: $epicName, start: $from, finish: $to}
    order_by: {date: asc}
    where: {epic_name: {_eq: $epicName}}
  ) {
    epic_name
    total_closed
    total_opened
    date
  }
}
    `

export const useGetBurnupPerEpicQuery = <
  TData = Types.GetBurnupPerEpicQuery,
  TError = GraphqlApiError,
>(
  variables: Types.GetBurnupPerEpicQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetBurnupPerEpicQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetBurnupPerEpicQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetBurnupPerEpicQuery, TError, TData>({
    queryKey: ['getBurnupPerEpic', variables],
    queryFn: createFetcher<
      Types.GetBurnupPerEpicQuery,
      Types.GetBurnupPerEpicQueryVariables
    >(GetBurnupPerEpicDocument, variables),
    ...options,
  })
}

useGetBurnupPerEpicQuery.getKey = (
  variables: Types.GetBurnupPerEpicQueryVariables
) => ['getBurnupPerEpic', variables]

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
    labels
  }
}
    `

export const useGetIssuesByEpicQuery = <
  TData = Types.GetIssuesByEpicQuery,
  TError = GraphqlApiError,
>(
  variables: Types.GetIssuesByEpicQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetIssuesByEpicQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetIssuesByEpicQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetIssuesByEpicQuery, TError, TData>({
    queryKey: ['getIssuesByEpic', variables],
    queryFn: createFetcher<
      Types.GetIssuesByEpicQuery,
      Types.GetIssuesByEpicQueryVariables
    >(GetIssuesByEpicDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables: Types.GetEpicIssuesCountQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetEpicIssuesCountQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetEpicIssuesCountQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetEpicIssuesCountQuery, TError, TData>({
    queryKey: ['getEpicIssuesCount', variables],
    queryFn: createFetcher<
      Types.GetEpicIssuesCountQuery,
      Types.GetEpicIssuesCountQueryVariables
    >(GetEpicIssuesCountDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables: Types.GetFiltersWithEpicQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetFiltersWithEpicQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetFiltersWithEpicQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetFiltersWithEpicQuery, TError, TData>({
    queryKey: ['getFiltersWithEpic', variables],
    queryFn: createFetcher<
      Types.GetFiltersWithEpicQuery,
      Types.GetFiltersWithEpicQueryVariables
    >(GetFiltersWithEpicDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables?: Types.GetEpicMenuLinksQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetEpicMenuLinksQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetEpicMenuLinksQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetEpicMenuLinksQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['getEpicMenuLinks']
        : ['getEpicMenuLinks', variables],
    queryFn: createFetcher<
      Types.GetEpicMenuLinksQuery,
      Types.GetEpicMenuLinksQueryVariables
    >(GetEpicMenuLinksDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables?: Types.GetRepositoriesQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetRepositoriesQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetRepositoriesQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetRepositoriesQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['getRepositories']
        : ['getRepositories', variables],
    queryFn: createFetcher<
      Types.GetRepositoriesQuery,
      Types.GetRepositoriesQueryVariables
    >(GetRepositoriesDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables: Types.GetOrphansQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetOrphansQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<Types.GetOrphansQuery, TError, TData>['queryKey']
  }
) => {
  return useQuery<Types.GetOrphansQuery, TError, TData>({
    queryKey: ['getOrphans', variables],
    queryFn: createFetcher<
      Types.GetOrphansQuery,
      Types.GetOrphansQueryVariables
    >(GetOrphansDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables: Types.GetOrphansCountQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetOrphansCountQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetOrphansCountQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetOrphansCountQuery, TError, TData>({
    queryKey: ['getOrphansCount', variables],
    queryFn: createFetcher<
      Types.GetOrphansCountQuery,
      Types.GetOrphansCountQueryVariables
    >(GetOrphansCountDocument, variables),
    ...options,
  })
}

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
  TError = GraphqlApiError,
>(
  variables?: Types.GetFiltersForOrphansQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetFiltersForOrphansQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetFiltersForOrphansQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetFiltersForOrphansQuery, TError, TData>({
    queryKey:
      variables === undefined
        ? ['getFiltersForOrphans']
        : ['getFiltersForOrphans', variables],
    queryFn: createFetcher<
      Types.GetFiltersForOrphansQuery,
      Types.GetFiltersForOrphansQueryVariables
    >(GetFiltersForOrphansDocument, variables),
    ...options,
  })
}

useGetFiltersForOrphansQuery.getKey = (
  variables?: Types.GetFiltersForOrphansQueryVariables
) =>
  variables === undefined
    ? ['getFiltersForOrphans']
    : ['getFiltersForOrphans', variables]

export const GetInitialDatePerEpicDocument = `
    query getInitialDatePerEpic($epicName: String!) {
  gh_epic_issues(
    where: {epic_name: {_eq: $epicName}}
    order_by: {created_at: asc}
    limit: 1
  ) {
    created_at
  }
}
    `

export const useGetInitialDatePerEpicQuery = <
  TData = Types.GetInitialDatePerEpicQuery,
  TError = GraphqlApiError,
>(
  variables: Types.GetInitialDatePerEpicQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.GetInitialDatePerEpicQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<
      Types.GetInitialDatePerEpicQuery,
      TError,
      TData
    >['queryKey']
  }
) => {
  return useQuery<Types.GetInitialDatePerEpicQuery, TError, TData>({
    queryKey: ['getInitialDatePerEpic', variables],
    queryFn: createFetcher<
      Types.GetInitialDatePerEpicQuery,
      Types.GetInitialDatePerEpicQueryVariables
    >(GetInitialDatePerEpicDocument, variables),
    ...options,
  })
}

useGetInitialDatePerEpicQuery.getKey = (
  variables: Types.GetInitialDatePerEpicQueryVariables
) => ['getInitialDatePerEpic', variables]

export const MilestonesDocument = `
    query Milestones($where: gh_milestones_bool_exp, $orderBy: [gh_milestones_order_by!]) {
  gh_milestones(where: $where, order_by: $orderBy) {
    id
    number
    created_at
    due_on
    title
    repository
    html_url
    description
  }
}
    `

export const useMilestonesQuery = <
  TData = Types.MilestonesQuery,
  TError = GraphqlApiError,
>(
  variables?: Types.MilestonesQueryVariables,
  options?: Omit<
    UseQueryOptions<Types.MilestonesQuery, TError, TData>,
    'queryKey'
  > & {
    queryKey?: UseQueryOptions<Types.MilestonesQuery, TError, TData>['queryKey']
  }
) => {
  return useQuery<Types.MilestonesQuery, TError, TData>({
    queryKey:
      variables === undefined ? ['Milestones'] : ['Milestones', variables],
    queryFn: createFetcher<
      Types.MilestonesQuery,
      Types.MilestonesQueryVariables
    >(MilestonesDocument, variables),
    ...options,
  })
}

useMilestonesQuery.getKey = (variables?: Types.MilestonesQueryVariables) =>
  variables === undefined ? ['Milestones'] : ['Milestones', variables]
