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
  startDate?: Types.InputMaybe<Types.Scalars['timestamptz']['input']>
}>

export type GetBurnupQuery = {
  __typename?: 'query_root'
  gh_burnup: Array<{
    __typename?: 'gh_burnup'
    epic_name?: string | null
    total_closed_issues?: any | null
    total_opened_issues?: any | null
    date_field?: any | null
  }>
}

export type GetIssuesByEpicQueryVariables = Types.Exact<{
  epicName: Types.Scalars['String']['input']
  author?: Types.InputMaybe<
    Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']
  >
  assignee?: Types.InputMaybe<
    Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']
  >
  repository?: Types.InputMaybe<
    Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']
  >
  authorExists: Types.Scalars['Boolean']['input']
  assigneeExists: Types.Scalars['Boolean']['input']
  repositoryExists: Types.Scalars['Boolean']['input']
  state: Types.Scalars['String']['input']
  limit: Types.Scalars['Int']['input']
  offset: Types.Scalars['Int']['input']
}>

export type GetIssuesByEpicQuery = {
  __typename?: 'query_root'
  gh_epic_issues: Array<{
    __typename?: 'gh_epic_issues'
    assignee?: string | null
    author?: string | null
    repository?: string | null
    closed_at?: any | null
    created_at?: any | null
    epic_color?: string | null
    epic_name?: string | null
    stage?: string | null
    title?: string | null
    issue_number?: any | null
    issue_url?: string | null
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

export type GetFiltersQueryVariables = Types.Exact<{
  epicName: Types.Scalars['String']['input']
}>

export type GetFiltersQuery = {
  __typename?: 'query_root'
  authors: Array<{ __typename?: 'gh_epic_issues'; author?: string | null }>
  assignees: Array<{ __typename?: 'gh_epic_issues'; assignee?: string | null }>
  repos: Array<{ __typename?: 'gh_epic_issues'; repository?: string | null }>
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
