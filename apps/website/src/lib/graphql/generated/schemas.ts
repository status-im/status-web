export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>
}
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>
}
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T
> = { [_ in K]?: never }
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never
    }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string }
  String: { input: string; output: string }
  Boolean: { input: boolean; output: boolean }
  Int: { input: number; output: number }
  Float: { input: number; output: number }
  bigint: { input: any; output: any }
  timestamptz: { input: any; output: any }
}

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']['input']>
  _gt?: InputMaybe<Scalars['String']['input']>
  _gte?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']['input']>
  _in?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']['input']>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']['input']>
  _lt?: InputMaybe<Scalars['String']['input']>
  _lte?: InputMaybe<Scalars['String']['input']>
  _neq?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']['input']>
  _nin?: InputMaybe<Array<Scalars['String']['input']>>
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']['input']>
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']['input']>
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']['input']>
  _gt?: InputMaybe<Scalars['bigint']['input']>
  _gte?: InputMaybe<Scalars['bigint']['input']>
  _in?: InputMaybe<Array<Scalars['bigint']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['bigint']['input']>
  _lte?: InputMaybe<Scalars['bigint']['input']>
  _neq?: InputMaybe<Scalars['bigint']['input']>
  _nin?: InputMaybe<Array<Scalars['bigint']['input']>>
}

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC',
}

/** columns and relationships of "gh_burnup" */
export type Gh_Burnup = {
  __typename?: 'gh_burnup'
  date_field?: Maybe<Scalars['timestamptz']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  total_closed_issues?: Maybe<Scalars['bigint']['output']>
  total_opened_issues?: Maybe<Scalars['bigint']['output']>
}

/** Boolean expression to filter rows from the table "gh_burnup". All fields are combined with a logical 'AND'. */
export type Gh_Burnup_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Burnup_Bool_Exp>>
  _not?: InputMaybe<Gh_Burnup_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Burnup_Bool_Exp>>
  date_field?: InputMaybe<Timestamptz_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  total_closed_issues?: InputMaybe<Bigint_Comparison_Exp>
  total_opened_issues?: InputMaybe<Bigint_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_burnup". */
export type Gh_Burnup_Order_By = {
  date_field?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  total_closed_issues?: InputMaybe<Order_By>
  total_opened_issues?: InputMaybe<Order_By>
}

/** select columns of table "gh_burnup" */
export enum Gh_Burnup_Select_Column {
  /** column name */
  DateField = 'date_field',
  /** column name */
  EpicName = 'epic_name',
  /** column name */
  TotalClosedIssues = 'total_closed_issues',
  /** column name */
  TotalOpenedIssues = 'total_opened_issues',
}

/** Streaming cursor of the table "gh_burnup" */
export type Gh_Burnup_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Burnup_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Burnup_Stream_Cursor_Value_Input = {
  date_field?: InputMaybe<Scalars['timestamptz']['input']>
  epic_name?: InputMaybe<Scalars['String']['input']>
  total_closed_issues?: InputMaybe<Scalars['bigint']['input']>
  total_opened_issues?: InputMaybe<Scalars['bigint']['input']>
}

/** columns and relationships of "gh_epic_issues" */
export type Gh_Epic_Issues = {
  __typename?: 'gh_epic_issues'
  assignee?: Maybe<Scalars['String']['output']>
  author?: Maybe<Scalars['String']['output']>
  closed_at?: Maybe<Scalars['timestamptz']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  epic_color?: Maybe<Scalars['String']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  issue_number?: Maybe<Scalars['bigint']['output']>
  issue_url?: Maybe<Scalars['String']['output']>
  labels?: Maybe<Scalars['String']['output']>
  repository?: Maybe<Scalars['String']['output']>
  stage?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the table "gh_epic_issues". All fields are combined with a logical 'AND'. */
export type Gh_Epic_Issues_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Epic_Issues_Bool_Exp>>
  _not?: InputMaybe<Gh_Epic_Issues_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Epic_Issues_Bool_Exp>>
  assignee?: InputMaybe<String_Comparison_Exp>
  author?: InputMaybe<String_Comparison_Exp>
  closed_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  epic_color?: InputMaybe<String_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  issue_number?: InputMaybe<Bigint_Comparison_Exp>
  issue_url?: InputMaybe<String_Comparison_Exp>
  labels?: InputMaybe<String_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  stage?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_epic_issues". */
export type Gh_Epic_Issues_Order_By = {
  assignee?: InputMaybe<Order_By>
  author?: InputMaybe<Order_By>
  closed_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  epic_color?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  issue_number?: InputMaybe<Order_By>
  issue_url?: InputMaybe<Order_By>
  labels?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  stage?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
}

/** select columns of table "gh_epic_issues" */
export enum Gh_Epic_Issues_Select_Column {
  /** column name */
  Assignee = 'assignee',
  /** column name */
  Author = 'author',
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EpicColor = 'epic_color',
  /** column name */
  EpicName = 'epic_name',
  /** column name */
  IssueNumber = 'issue_number',
  /** column name */
  IssueUrl = 'issue_url',
  /** column name */
  Labels = 'labels',
  /** column name */
  Repository = 'repository',
  /** column name */
  Stage = 'stage',
  /** column name */
  Title = 'title',
}

/** Streaming cursor of the table "gh_epic_issues" */
export type Gh_Epic_Issues_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Epic_Issues_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Epic_Issues_Stream_Cursor_Value_Input = {
  assignee?: InputMaybe<Scalars['String']['input']>
  author?: InputMaybe<Scalars['String']['input']>
  closed_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  epic_color?: InputMaybe<Scalars['String']['input']>
  epic_name?: InputMaybe<Scalars['String']['input']>
  issue_number?: InputMaybe<Scalars['bigint']['input']>
  issue_url?: InputMaybe<Scalars['String']['input']>
  labels?: InputMaybe<Scalars['String']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  stage?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "gh_epics" */
export type Gh_Epics = {
  __typename?: 'gh_epics'
  closed_count?: Maybe<Scalars['bigint']['output']>
  epic_color?: Maybe<Scalars['String']['output']>
  epic_description?: Maybe<Scalars['String']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  opened_count?: Maybe<Scalars['bigint']['output']>
  status?: Maybe<Scalars['String']['output']>
  total_count?: Maybe<Scalars['bigint']['output']>
}

/** Boolean expression to filter rows from the table "gh_epics". All fields are combined with a logical 'AND'. */
export type Gh_Epics_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Epics_Bool_Exp>>
  _not?: InputMaybe<Gh_Epics_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Epics_Bool_Exp>>
  closed_count?: InputMaybe<Bigint_Comparison_Exp>
  epic_color?: InputMaybe<String_Comparison_Exp>
  epic_description?: InputMaybe<String_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  opened_count?: InputMaybe<Bigint_Comparison_Exp>
  status?: InputMaybe<String_Comparison_Exp>
  total_count?: InputMaybe<Bigint_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_epics". */
export type Gh_Epics_Order_By = {
  closed_count?: InputMaybe<Order_By>
  epic_color?: InputMaybe<Order_By>
  epic_description?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  opened_count?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  total_count?: InputMaybe<Order_By>
}

/** select columns of table "gh_epics" */
export enum Gh_Epics_Select_Column {
  /** column name */
  ClosedCount = 'closed_count',
  /** column name */
  EpicColor = 'epic_color',
  /** column name */
  EpicDescription = 'epic_description',
  /** column name */
  EpicName = 'epic_name',
  /** column name */
  OpenedCount = 'opened_count',
  /** column name */
  Status = 'status',
  /** column name */
  TotalCount = 'total_count',
}

/** Streaming cursor of the table "gh_epics" */
export type Gh_Epics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Epics_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Epics_Stream_Cursor_Value_Input = {
  closed_count?: InputMaybe<Scalars['bigint']['input']>
  epic_color?: InputMaybe<Scalars['String']['input']>
  epic_description?: InputMaybe<Scalars['String']['input']>
  epic_name?: InputMaybe<Scalars['String']['input']>
  opened_count?: InputMaybe<Scalars['bigint']['input']>
  status?: InputMaybe<Scalars['String']['input']>
  total_count?: InputMaybe<Scalars['bigint']['input']>
}

/** columns and relationships of "gh_issues" */
export type Gh_Issues = {
  __typename?: 'gh_issues'
  assignee?: Maybe<Scalars['String']['output']>
  author?: Maybe<Scalars['String']['output']>
  closed_at?: Maybe<Scalars['timestamptz']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  issue_number?: Maybe<Scalars['bigint']['output']>
  issue_url?: Maybe<Scalars['String']['output']>
  labels?: Maybe<Scalars['String']['output']>
  repository?: Maybe<Scalars['String']['output']>
  stage?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the table "gh_issues". All fields are combined with a logical 'AND'. */
export type Gh_Issues_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Issues_Bool_Exp>>
  _not?: InputMaybe<Gh_Issues_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Issues_Bool_Exp>>
  assignee?: InputMaybe<String_Comparison_Exp>
  author?: InputMaybe<String_Comparison_Exp>
  closed_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  issue_number?: InputMaybe<Bigint_Comparison_Exp>
  issue_url?: InputMaybe<String_Comparison_Exp>
  labels?: InputMaybe<String_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  stage?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_issues". */
export type Gh_Issues_Order_By = {
  assignee?: InputMaybe<Order_By>
  author?: InputMaybe<Order_By>
  closed_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  issue_number?: InputMaybe<Order_By>
  issue_url?: InputMaybe<Order_By>
  labels?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  stage?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
}

/** select columns of table "gh_issues" */
export enum Gh_Issues_Select_Column {
  /** column name */
  Assignee = 'assignee',
  /** column name */
  Author = 'author',
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IssueNumber = 'issue_number',
  /** column name */
  IssueUrl = 'issue_url',
  /** column name */
  Labels = 'labels',
  /** column name */
  Repository = 'repository',
  /** column name */
  Stage = 'stage',
  /** column name */
  Title = 'title',
}

/** Streaming cursor of the table "gh_issues" */
export type Gh_Issues_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Issues_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Issues_Stream_Cursor_Value_Input = {
  assignee?: InputMaybe<Scalars['String']['input']>
  author?: InputMaybe<Scalars['String']['input']>
  closed_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  issue_number?: InputMaybe<Scalars['bigint']['input']>
  issue_url?: InputMaybe<Scalars['String']['input']>
  labels?: InputMaybe<Scalars['String']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  stage?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "gh_orphans" */
export type Gh_Orphans = {
  __typename?: 'gh_orphans'
  assignee?: Maybe<Scalars['String']['output']>
  author?: Maybe<Scalars['String']['output']>
  closed_at?: Maybe<Scalars['timestamptz']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  issue_number?: Maybe<Scalars['bigint']['output']>
  issue_url?: Maybe<Scalars['String']['output']>
  labels?: Maybe<Scalars['String']['output']>
  repository?: Maybe<Scalars['String']['output']>
  stage?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the table "gh_orphans". All fields are combined with a logical 'AND'. */
export type Gh_Orphans_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Orphans_Bool_Exp>>
  _not?: InputMaybe<Gh_Orphans_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Orphans_Bool_Exp>>
  assignee?: InputMaybe<String_Comparison_Exp>
  author?: InputMaybe<String_Comparison_Exp>
  closed_at?: InputMaybe<Timestamptz_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  issue_number?: InputMaybe<Bigint_Comparison_Exp>
  issue_url?: InputMaybe<String_Comparison_Exp>
  labels?: InputMaybe<String_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  stage?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_orphans". */
export type Gh_Orphans_Order_By = {
  assignee?: InputMaybe<Order_By>
  author?: InputMaybe<Order_By>
  closed_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  issue_number?: InputMaybe<Order_By>
  issue_url?: InputMaybe<Order_By>
  labels?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  stage?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
}

/** select columns of table "gh_orphans" */
export enum Gh_Orphans_Select_Column {
  /** column name */
  Assignee = 'assignee',
  /** column name */
  Author = 'author',
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IssueNumber = 'issue_number',
  /** column name */
  IssueUrl = 'issue_url',
  /** column name */
  Labels = 'labels',
  /** column name */
  Repository = 'repository',
  /** column name */
  Stage = 'stage',
  /** column name */
  Title = 'title',
}

/** Streaming cursor of the table "gh_orphans" */
export type Gh_Orphans_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Orphans_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Orphans_Stream_Cursor_Value_Input = {
  assignee?: InputMaybe<Scalars['String']['input']>
  author?: InputMaybe<Scalars['String']['input']>
  closed_at?: InputMaybe<Scalars['timestamptz']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  issue_number?: InputMaybe<Scalars['bigint']['input']>
  issue_url?: InputMaybe<Scalars['String']['input']>
  labels?: InputMaybe<Scalars['String']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  stage?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "gh_repositories" */
export type Gh_Repositories = {
  __typename?: 'gh_repositories'
  description?: Maybe<Scalars['String']['output']>
  full_name?: Maybe<Scalars['String']['output']>
  name?: Maybe<Scalars['String']['output']>
  open_issues_count?: Maybe<Scalars['bigint']['output']>
  stargazers_count?: Maybe<Scalars['bigint']['output']>
  visibility?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the table "gh_repositories". All fields are combined with a logical 'AND'. */
export type Gh_Repositories_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Repositories_Bool_Exp>>
  _not?: InputMaybe<Gh_Repositories_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Repositories_Bool_Exp>>
  description?: InputMaybe<String_Comparison_Exp>
  full_name?: InputMaybe<String_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  open_issues_count?: InputMaybe<Bigint_Comparison_Exp>
  stargazers_count?: InputMaybe<Bigint_Comparison_Exp>
  visibility?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_repositories". */
export type Gh_Repositories_Order_By = {
  description?: InputMaybe<Order_By>
  full_name?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  open_issues_count?: InputMaybe<Order_By>
  stargazers_count?: InputMaybe<Order_By>
  visibility?: InputMaybe<Order_By>
}

/** select columns of table "gh_repositories" */
export enum Gh_Repositories_Select_Column {
  /** column name */
  Description = 'description',
  /** column name */
  FullName = 'full_name',
  /** column name */
  Name = 'name',
  /** column name */
  OpenIssuesCount = 'open_issues_count',
  /** column name */
  StargazersCount = 'stargazers_count',
  /** column name */
  Visibility = 'visibility',
}

/** Streaming cursor of the table "gh_repositories" */
export type Gh_Repositories_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Repositories_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Repositories_Stream_Cursor_Value_Input = {
  description?: InputMaybe<Scalars['String']['input']>
  full_name?: InputMaybe<Scalars['String']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  open_issues_count?: InputMaybe<Scalars['bigint']['input']>
  stargazers_count?: InputMaybe<Scalars['bigint']['input']>
  visibility?: InputMaybe<Scalars['String']['input']>
}

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last',
}

export type Query_Root = {
  __typename?: 'query_root'
  /** fetch data from the table: "gh_burnup" */
  gh_burnup: Array<Gh_Burnup>
  /** fetch data from the table: "gh_epic_issues" */
  gh_epic_issues: Array<Gh_Epic_Issues>
  /** fetch data from the table: "gh_epics" */
  gh_epics: Array<Gh_Epics>
  /** fetch data from the table: "gh_issues" */
  gh_issues: Array<Gh_Issues>
  /** fetch data from the table: "gh_orphans" */
  gh_orphans: Array<Gh_Orphans>
  /** fetch data from the table: "gh_repositories" */
  gh_repositories: Array<Gh_Repositories>
}

export type Query_RootGh_BurnupArgs = {
  distinct_on?: InputMaybe<Array<Gh_Burnup_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Burnup_Order_By>>
  where?: InputMaybe<Gh_Burnup_Bool_Exp>
}

export type Query_RootGh_Epic_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Epic_Issues_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Epic_Issues_Order_By>>
  where?: InputMaybe<Gh_Epic_Issues_Bool_Exp>
}

export type Query_RootGh_EpicsArgs = {
  distinct_on?: InputMaybe<Array<Gh_Epics_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Epics_Order_By>>
  where?: InputMaybe<Gh_Epics_Bool_Exp>
}

export type Query_RootGh_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Issues_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Issues_Order_By>>
  where?: InputMaybe<Gh_Issues_Bool_Exp>
}

export type Query_RootGh_OrphansArgs = {
  distinct_on?: InputMaybe<Array<Gh_Orphans_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Orphans_Order_By>>
  where?: InputMaybe<Gh_Orphans_Bool_Exp>
}

export type Query_RootGh_RepositoriesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Repositories_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Repositories_Order_By>>
  where?: InputMaybe<Gh_Repositories_Bool_Exp>
}

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** fetch data from the table: "gh_burnup" */
  gh_burnup: Array<Gh_Burnup>
  /** fetch data from the table in a streaming manner: "gh_burnup" */
  gh_burnup_stream: Array<Gh_Burnup>
  /** fetch data from the table: "gh_epic_issues" */
  gh_epic_issues: Array<Gh_Epic_Issues>
  /** fetch data from the table in a streaming manner: "gh_epic_issues" */
  gh_epic_issues_stream: Array<Gh_Epic_Issues>
  /** fetch data from the table: "gh_epics" */
  gh_epics: Array<Gh_Epics>
  /** fetch data from the table in a streaming manner: "gh_epics" */
  gh_epics_stream: Array<Gh_Epics>
  /** fetch data from the table: "gh_issues" */
  gh_issues: Array<Gh_Issues>
  /** fetch data from the table in a streaming manner: "gh_issues" */
  gh_issues_stream: Array<Gh_Issues>
  /** fetch data from the table: "gh_orphans" */
  gh_orphans: Array<Gh_Orphans>
  /** fetch data from the table in a streaming manner: "gh_orphans" */
  gh_orphans_stream: Array<Gh_Orphans>
  /** fetch data from the table: "gh_repositories" */
  gh_repositories: Array<Gh_Repositories>
  /** fetch data from the table in a streaming manner: "gh_repositories" */
  gh_repositories_stream: Array<Gh_Repositories>
}

export type Subscription_RootGh_BurnupArgs = {
  distinct_on?: InputMaybe<Array<Gh_Burnup_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Burnup_Order_By>>
  where?: InputMaybe<Gh_Burnup_Bool_Exp>
}

export type Subscription_RootGh_Burnup_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Burnup_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Burnup_Bool_Exp>
}

export type Subscription_RootGh_Epic_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Epic_Issues_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Epic_Issues_Order_By>>
  where?: InputMaybe<Gh_Epic_Issues_Bool_Exp>
}

export type Subscription_RootGh_Epic_Issues_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Epic_Issues_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Epic_Issues_Bool_Exp>
}

export type Subscription_RootGh_EpicsArgs = {
  distinct_on?: InputMaybe<Array<Gh_Epics_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Epics_Order_By>>
  where?: InputMaybe<Gh_Epics_Bool_Exp>
}

export type Subscription_RootGh_Epics_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Epics_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Epics_Bool_Exp>
}

export type Subscription_RootGh_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Issues_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Issues_Order_By>>
  where?: InputMaybe<Gh_Issues_Bool_Exp>
}

export type Subscription_RootGh_Issues_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Issues_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Issues_Bool_Exp>
}

export type Subscription_RootGh_OrphansArgs = {
  distinct_on?: InputMaybe<Array<Gh_Orphans_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Orphans_Order_By>>
  where?: InputMaybe<Gh_Orphans_Bool_Exp>
}

export type Subscription_RootGh_Orphans_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Orphans_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Orphans_Bool_Exp>
}

export type Subscription_RootGh_RepositoriesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Repositories_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Repositories_Order_By>>
  where?: InputMaybe<Gh_Repositories_Bool_Exp>
}

export type Subscription_RootGh_Repositories_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Repositories_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Repositories_Bool_Exp>
}

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']['input']>
  _gt?: InputMaybe<Scalars['timestamptz']['input']>
  _gte?: InputMaybe<Scalars['timestamptz']['input']>
  _in?: InputMaybe<Array<Scalars['timestamptz']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamptz']['input']>
  _lte?: InputMaybe<Scalars['timestamptz']['input']>
  _neq?: InputMaybe<Scalars['timestamptz']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamptz']['input']>>
}
