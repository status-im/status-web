import type * as Types from './schemas'

export type GetEpicMenuLinksQueryVariables = Types.Exact<{
  [key: string]: never
}>

export type GetEpicMenuLinksQuery = {
  __typename?: 'query_root'
  gh_epics: Array<{
    __typename?: 'gh_epics'
    epic_name?: string | null
    status?: string | null
  }>
}

export type GetBurnupQueryVariables = Types.Exact<{
  epicName: Types.Scalars['String']['input']
}>

export type GetBurnupQuery = {
  __typename?: 'query_root'
  gh_burnup: Array<{
    __typename?: 'gh_burnup'
    author?: string | null
    assignee?: string | null
    cumulative_closed_issues?: any | null
    cumulative_opened_issues?: any | null
    date_field?: any | null
    epic_name?: string | null
    epic_color?: string | null
    repository?: string | null
  }>
}

export type GetIssuesByEpicQueryVariables = Types.Exact<{
  epicName: Types.Scalars['String']['input']
  limit: Types.Scalars['Int']['input']
  offset: Types.Scalars['Int']['input']
}>

export type GetIssuesByEpicQuery = {
  __typename?: 'query_root'
  gh_epic_issues: Array<{
    __typename?: 'gh_epic_issues'
    assignee?: string | null
    author?: string | null
    closed_at?: any | null
    created_at?: any | null
    epic_color?: string | null
    epic_name?: string | null
    repository?: string | null
    stage?: string | null
    title?: string | null
    issue_number?: any | null
  }>
}

export type GetEpicIssuesCountQueryVariables = Types.Exact<{
  epicName: Types.Scalars['String']['input']
}>

export type GetEpicIssuesCountQuery = {
  __typename?: 'query_root'
  gh_epic_issues: Array<{
    __typename?: 'gh_epic_issues'
    closed_at?: any | null
  }>
}

export type GetOrphansQueryVariables = Types.Exact<{ [key: string]: never }>

export type GetOrphansQuery = {
  __typename?: 'query_root'
  gh_orphans: Array<{
    __typename?: 'gh_orphans'
    labels?: string | null
    assignee?: string | null
    author?: string | null
    issue_number?: any | null
    closed_at?: any | null
    repository?: string | null
    stage?: string | null
    title?: string | null
  }>
}

export type GetRepositoriesQueryVariables = Types.Exact<{
  [key: string]: never
}>

export type GetRepositoriesQuery = {
  __typename?: 'query_root'
  gh_repositories: Array<{
    __typename?: 'gh_repositories'
    description?: string | null
    full_name?: string | null
    name?: string | null
    open_issues_count?: any | null
    stargazers_count?: any | null
    visibility?: string | null
  }>
}
