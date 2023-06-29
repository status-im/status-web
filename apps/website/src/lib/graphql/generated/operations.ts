import type * as Types from './schemas'

export type GetBurnupQueryVariables = Types.Exact<{
  epicNames?: Types.InputMaybe<
    Array<Types.Scalars['String']['input']> | Types.Scalars['String']['input']
  >
  from?: Types.InputMaybe<Types.Scalars['timestamptz']['input']>
  to?: Types.InputMaybe<Types.Scalars['timestamptz']['input']>
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
  where: Types.Gh_Epic_Issues_Bool_Exp
  limit: Types.Scalars['Int']['input']
  offset: Types.Scalars['Int']['input']
  orderBy?: Types.InputMaybe<Types.Order_By>
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
    issue_url?: string | null
  }>
}

export type GetEpicIssuesCountQueryVariables = Types.Exact<{
  where: Types.Gh_Epic_Issues_Bool_Exp
}>

export type GetEpicIssuesCountQuery = {
  __typename?: 'query_root'
  gh_epic_issues: Array<{
    __typename?: 'gh_epic_issues'
    closed_at?: any | null
  }>
}

export type GetFiltersWithEpicQueryVariables = Types.Exact<{
  epicName: Types.Scalars['String']['input']
}>

export type GetFiltersWithEpicQuery = {
  __typename?: 'query_root'
  authors: Array<{ __typename?: 'gh_epic_issues'; author?: string | null }>
  assignees: Array<{ __typename?: 'gh_epic_issues'; assignee?: string | null }>
  repos: Array<{ __typename?: 'gh_epic_issues'; repository?: string | null }>
}

export type GetEpicMenuLinksQueryVariables = Types.Exact<{
  where?: Types.InputMaybe<Types.Gh_Epics_Bool_Exp>
  orderBy?: Types.InputMaybe<
    Array<Types.Gh_Epics_Order_By> | Types.Gh_Epics_Order_By
  >
  limit?: Types.InputMaybe<Types.Scalars['Int']['input']>
  offset?: Types.InputMaybe<Types.Scalars['Int']['input']>
}>

export type GetEpicMenuLinksQuery = {
  __typename?: 'query_root'
  gh_epics: Array<{
    __typename?: 'gh_epics'
    epic_name?: string | null
    epic_color?: string | null
    epic_description?: string | null
    status?: string | null
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

export type GetOrphansQueryVariables = Types.Exact<{
  where: Types.Gh_Orphans_Bool_Exp
  limit: Types.Scalars['Int']['input']
  offset: Types.Scalars['Int']['input']
  orderBy?: Types.InputMaybe<Types.Order_By>
}>

export type GetOrphansQuery = {
  __typename?: 'query_root'
  gh_orphans: Array<{
    __typename?: 'gh_orphans'
    labels?: string | null
    assignee?: string | null
    author?: string | null
    issue_number?: any | null
    issue_url?: string | null
    created_at?: any | null
    closed_at?: any | null
    repository?: string | null
    stage?: string | null
    title?: string | null
  }>
}

export type GetOrphansCountQueryVariables = Types.Exact<{
  where: Types.Gh_Orphans_Bool_Exp
}>

export type GetOrphansCountQuery = {
  __typename?: 'query_root'
  gh_orphans: Array<{ __typename?: 'gh_orphans'; closed_at?: any | null }>
}

export type GetFiltersForOrphansQueryVariables = Types.Exact<{
  [key: string]: never
}>

export type GetFiltersForOrphansQuery = {
  __typename?: 'query_root'
  authors: Array<{ __typename?: 'gh_orphans'; author?: string | null }>
  assignees: Array<{ __typename?: 'gh_orphans'; assignee?: string | null }>
  repos: Array<{ __typename?: 'gh_orphans'; repository?: string | null }>
}
