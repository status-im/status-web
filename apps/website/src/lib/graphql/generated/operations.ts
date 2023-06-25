import type * as Types from './schemas'

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
