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
  K extends keyof T,
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
  date: { input: any; output: any }
  float8: { input: any; output: any }
  jsonb: { input: any; output: any }
  timestamp: { input: any; output: any }
  timestamptz: { input: any; output: any }
}

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']['input']>
  _gt?: InputMaybe<Scalars['Boolean']['input']>
  _gte?: InputMaybe<Scalars['Boolean']['input']>
  _in?: InputMaybe<Array<Scalars['Boolean']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Boolean']['input']>
  _lte?: InputMaybe<Scalars['Boolean']['input']>
  _neq?: InputMaybe<Scalars['Boolean']['input']>
  _nin?: InputMaybe<Array<Scalars['Boolean']['input']>>
}

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']['input']>
  _gt?: InputMaybe<Scalars['Int']['input']>
  _gte?: InputMaybe<Scalars['Int']['input']>
  _in?: InputMaybe<Array<Scalars['Int']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['Int']['input']>
  _lte?: InputMaybe<Scalars['Int']['input']>
  _neq?: InputMaybe<Scalars['Int']['input']>
  _nin?: InputMaybe<Array<Scalars['Int']['input']>>
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

/** columns and relationships of "epic_issues_count" */
export type Epic_Issues_Count = {
  __typename?: 'epic_issues_count'
  date?: Maybe<Scalars['timestamp']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  total_closed?: Maybe<Scalars['Int']['output']>
  total_opened?: Maybe<Scalars['Int']['output']>
}

/** Boolean expression to filter rows from the table "epic_issues_count". All fields are combined with a logical 'AND'. */
export type Epic_Issues_Count_Bool_Exp = {
  _and?: InputMaybe<Array<Epic_Issues_Count_Bool_Exp>>
  _not?: InputMaybe<Epic_Issues_Count_Bool_Exp>
  _or?: InputMaybe<Array<Epic_Issues_Count_Bool_Exp>>
  date?: InputMaybe<Timestamp_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  total_closed?: InputMaybe<Int_Comparison_Exp>
  total_opened?: InputMaybe<Int_Comparison_Exp>
}

/** Ordering options when selecting data from "epic_issues_count". */
export type Epic_Issues_Count_Order_By = {
  date?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  total_closed?: InputMaybe<Order_By>
  total_opened?: InputMaybe<Order_By>
}

/** select columns of table "epic_issues_count" */
export enum Epic_Issues_Count_Select_Column {
  /** column name */
  Date = 'date',
  /** column name */
  EpicName = 'epic_name',
  /** column name */
  TotalClosed = 'total_closed',
  /** column name */
  TotalOpened = 'total_opened',
}

/** Streaming cursor of the table "epic_issues_count" */
export type Epic_Issues_Count_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Epic_Issues_Count_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Epic_Issues_Count_Stream_Cursor_Value_Input = {
  date?: InputMaybe<Scalars['timestamp']['input']>
  epic_name?: InputMaybe<Scalars['String']['input']>
  total_closed?: InputMaybe<Scalars['Int']['input']>
  total_opened?: InputMaybe<Scalars['Int']['input']>
}

/** Boolean expression to compare columns of type "float8". All fields are combined with logical 'AND'. */
export type Float8_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['float8']['input']>
  _gt?: InputMaybe<Scalars['float8']['input']>
  _gte?: InputMaybe<Scalars['float8']['input']>
  _in?: InputMaybe<Array<Scalars['float8']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['float8']['input']>
  _lte?: InputMaybe<Scalars['float8']['input']>
  _neq?: InputMaybe<Scalars['float8']['input']>
  _nin?: InputMaybe<Array<Scalars['float8']['input']>>
}

/** columns and relationships of "gh_burnup" */
export type Gh_Burnup = {
  __typename?: 'gh_burnup'
  date_field?: Maybe<Scalars['timestamptz']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  total_closed_issues?: Maybe<Scalars['float8']['output']>
  total_opened_issues?: Maybe<Scalars['float8']['output']>
}

/** Boolean expression to filter rows from the table "gh_burnup". All fields are combined with a logical 'AND'. */
export type Gh_Burnup_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Burnup_Bool_Exp>>
  _not?: InputMaybe<Gh_Burnup_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Burnup_Bool_Exp>>
  date_field?: InputMaybe<Timestamptz_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  total_closed_issues?: InputMaybe<Float8_Comparison_Exp>
  total_opened_issues?: InputMaybe<Float8_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_burnup". */
export type Gh_Burnup_Order_By = {
  date_field?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  total_closed_issues?: InputMaybe<Order_By>
  total_opened_issues?: InputMaybe<Order_By>
}

export type Gh_Burnup_Per_Epic_Args = {
  epic_name?: InputMaybe<Scalars['String']['input']>
  finish?: InputMaybe<Scalars['date']['input']>
  start?: InputMaybe<Scalars['date']['input']>
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
  total_closed_issues?: InputMaybe<Scalars['float8']['input']>
  total_opened_issues?: InputMaybe<Scalars['float8']['input']>
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

/** columns and relationships of "gh_milestones" */
export type Gh_Milestones = {
  __typename?: 'gh_milestones'
  closed_at?: Maybe<Scalars['timestamp']['output']>
  closed_issues?: Maybe<Scalars['bigint']['output']>
  created_at?: Maybe<Scalars['timestamp']['output']>
  creator?: Maybe<Scalars['jsonb']['output']>
  description?: Maybe<Scalars['String']['output']>
  due_on?: Maybe<Scalars['timestamp']['output']>
  html_url?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['bigint']['output']>
  labels_url?: Maybe<Scalars['String']['output']>
  node_id?: Maybe<Scalars['String']['output']>
  number?: Maybe<Scalars['bigint']['output']>
  open_issues?: Maybe<Scalars['bigint']['output']>
  repository?: Maybe<Scalars['String']['output']>
  state?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamp']['output']>
  url?: Maybe<Scalars['String']['output']>
}

/** columns and relationships of "gh_milestones" */
export type Gh_MilestonesCreatorArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "gh_milestones". All fields are combined with a logical 'AND'. */
export type Gh_Milestones_Bool_Exp = {
  _and?: InputMaybe<Array<Gh_Milestones_Bool_Exp>>
  _not?: InputMaybe<Gh_Milestones_Bool_Exp>
  _or?: InputMaybe<Array<Gh_Milestones_Bool_Exp>>
  closed_at?: InputMaybe<Timestamp_Comparison_Exp>
  closed_issues?: InputMaybe<Bigint_Comparison_Exp>
  created_at?: InputMaybe<Timestamp_Comparison_Exp>
  creator?: InputMaybe<Jsonb_Comparison_Exp>
  description?: InputMaybe<String_Comparison_Exp>
  due_on?: InputMaybe<Timestamp_Comparison_Exp>
  html_url?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Bigint_Comparison_Exp>
  labels_url?: InputMaybe<String_Comparison_Exp>
  node_id?: InputMaybe<String_Comparison_Exp>
  number?: InputMaybe<Bigint_Comparison_Exp>
  open_issues?: InputMaybe<Bigint_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  state?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>
  url?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "gh_milestones". */
export type Gh_Milestones_Order_By = {
  closed_at?: InputMaybe<Order_By>
  closed_issues?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  creator?: InputMaybe<Order_By>
  description?: InputMaybe<Order_By>
  due_on?: InputMaybe<Order_By>
  html_url?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  labels_url?: InputMaybe<Order_By>
  node_id?: InputMaybe<Order_By>
  number?: InputMaybe<Order_By>
  open_issues?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  state?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  url?: InputMaybe<Order_By>
}

/** select columns of table "gh_milestones" */
export enum Gh_Milestones_Select_Column {
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  ClosedIssues = 'closed_issues',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Creator = 'creator',
  /** column name */
  Description = 'description',
  /** column name */
  DueOn = 'due_on',
  /** column name */
  HtmlUrl = 'html_url',
  /** column name */
  Id = 'id',
  /** column name */
  LabelsUrl = 'labels_url',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  Number = 'number',
  /** column name */
  OpenIssues = 'open_issues',
  /** column name */
  Repository = 'repository',
  /** column name */
  State = 'state',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url',
}

/** Streaming cursor of the table "gh_milestones" */
export type Gh_Milestones_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Gh_Milestones_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Gh_Milestones_Stream_Cursor_Value_Input = {
  closed_at?: InputMaybe<Scalars['timestamp']['input']>
  closed_issues?: InputMaybe<Scalars['bigint']['input']>
  created_at?: InputMaybe<Scalars['timestamp']['input']>
  creator?: InputMaybe<Scalars['jsonb']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  due_on?: InputMaybe<Scalars['timestamp']['input']>
  html_url?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['bigint']['input']>
  labels_url?: InputMaybe<Scalars['String']['input']>
  node_id?: InputMaybe<Scalars['String']['input']>
  number?: InputMaybe<Scalars['bigint']['input']>
  open_issues?: InputMaybe<Scalars['bigint']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
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

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>
}

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']['input']>
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']['input']>
  _eq?: InputMaybe<Scalars['jsonb']['input']>
  _gt?: InputMaybe<Scalars['jsonb']['input']>
  _gte?: InputMaybe<Scalars['jsonb']['input']>
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']['input']>
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']['input']>>
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']['input']>>
  _in?: InputMaybe<Array<Scalars['jsonb']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['jsonb']['input']>
  _lte?: InputMaybe<Scalars['jsonb']['input']>
  _neq?: InputMaybe<Scalars['jsonb']['input']>
  _nin?: InputMaybe<Array<Scalars['jsonb']['input']>>
}

/** columns and relationships of "logos_map_epics" */
export type Logos_Map_Epics = {
  __typename?: 'logos_map_epics'
  closed_count?: Maybe<Scalars['bigint']['output']>
  epic_color?: Maybe<Scalars['String']['output']>
  epic_description?: Maybe<Scalars['String']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  milestone?: Maybe<Scalars['String']['output']>
  opened_count?: Maybe<Scalars['bigint']['output']>
  program?: Maybe<Scalars['String']['output']>
  status?: Maybe<Scalars['String']['output']>
  total_count?: Maybe<Scalars['bigint']['output']>
}

/** Boolean expression to filter rows from the table "logos_map_epics". All fields are combined with a logical 'AND'. */
export type Logos_Map_Epics_Bool_Exp = {
  _and?: InputMaybe<Array<Logos_Map_Epics_Bool_Exp>>
  _not?: InputMaybe<Logos_Map_Epics_Bool_Exp>
  _or?: InputMaybe<Array<Logos_Map_Epics_Bool_Exp>>
  closed_count?: InputMaybe<Bigint_Comparison_Exp>
  epic_color?: InputMaybe<String_Comparison_Exp>
  epic_description?: InputMaybe<String_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  milestone?: InputMaybe<String_Comparison_Exp>
  opened_count?: InputMaybe<Bigint_Comparison_Exp>
  program?: InputMaybe<String_Comparison_Exp>
  status?: InputMaybe<String_Comparison_Exp>
  total_count?: InputMaybe<Bigint_Comparison_Exp>
}

/** Ordering options when selecting data from "logos_map_epics". */
export type Logos_Map_Epics_Order_By = {
  closed_count?: InputMaybe<Order_By>
  epic_color?: InputMaybe<Order_By>
  epic_description?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  milestone?: InputMaybe<Order_By>
  opened_count?: InputMaybe<Order_By>
  program?: InputMaybe<Order_By>
  status?: InputMaybe<Order_By>
  total_count?: InputMaybe<Order_By>
}

/** select columns of table "logos_map_epics" */
export enum Logos_Map_Epics_Select_Column {
  /** column name */
  ClosedCount = 'closed_count',
  /** column name */
  EpicColor = 'epic_color',
  /** column name */
  EpicDescription = 'epic_description',
  /** column name */
  EpicName = 'epic_name',
  /** column name */
  Milestone = 'milestone',
  /** column name */
  OpenedCount = 'opened_count',
  /** column name */
  Program = 'program',
  /** column name */
  Status = 'status',
  /** column name */
  TotalCount = 'total_count',
}

/** Streaming cursor of the table "logos_map_epics" */
export type Logos_Map_Epics_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logos_Map_Epics_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Logos_Map_Epics_Stream_Cursor_Value_Input = {
  closed_count?: InputMaybe<Scalars['bigint']['input']>
  epic_color?: InputMaybe<Scalars['String']['input']>
  epic_description?: InputMaybe<Scalars['String']['input']>
  epic_name?: InputMaybe<Scalars['String']['input']>
  milestone?: InputMaybe<Scalars['String']['input']>
  opened_count?: InputMaybe<Scalars['bigint']['input']>
  program?: InputMaybe<Scalars['String']['input']>
  status?: InputMaybe<Scalars['String']['input']>
  total_count?: InputMaybe<Scalars['bigint']['input']>
}

/** columns and relationships of "logos_map_issue_labels" */
export type Logos_Map_Issue_Labels = {
  __typename?: 'logos_map_issue_labels'
  color?: Maybe<Scalars['String']['output']>
  description?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['bigint']['output']>
  name?: Maybe<Scalars['String']['output']>
  program?: Maybe<Scalars['String']['output']>
  repository?: Maybe<Scalars['String']['output']>
  url?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the table "logos_map_issue_labels". All fields are combined with a logical 'AND'. */
export type Logos_Map_Issue_Labels_Bool_Exp = {
  _and?: InputMaybe<Array<Logos_Map_Issue_Labels_Bool_Exp>>
  _not?: InputMaybe<Logos_Map_Issue_Labels_Bool_Exp>
  _or?: InputMaybe<Array<Logos_Map_Issue_Labels_Bool_Exp>>
  color?: InputMaybe<String_Comparison_Exp>
  description?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Bigint_Comparison_Exp>
  name?: InputMaybe<String_Comparison_Exp>
  program?: InputMaybe<String_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  url?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "logos_map_issue_labels". */
export type Logos_Map_Issue_Labels_Order_By = {
  color?: InputMaybe<Order_By>
  description?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  name?: InputMaybe<Order_By>
  program?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  url?: InputMaybe<Order_By>
}

/** select columns of table "logos_map_issue_labels" */
export enum Logos_Map_Issue_Labels_Select_Column {
  /** column name */
  Color = 'color',
  /** column name */
  Description = 'description',
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name',
  /** column name */
  Program = 'program',
  /** column name */
  Repository = 'repository',
  /** column name */
  Url = 'url',
}

/** Streaming cursor of the table "logos_map_issue_labels" */
export type Logos_Map_Issue_Labels_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logos_Map_Issue_Labels_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Logos_Map_Issue_Labels_Stream_Cursor_Value_Input = {
  color?: InputMaybe<Scalars['String']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['bigint']['input']>
  name?: InputMaybe<Scalars['String']['input']>
  program?: InputMaybe<Scalars['String']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  url?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "logos_map_issues" */
export type Logos_Map_Issues = {
  __typename?: 'logos_map_issues'
  active_lock_reason?: Maybe<Scalars['String']['output']>
  assignee?: Maybe<Scalars['jsonb']['output']>
  assignees?: Maybe<Scalars['jsonb']['output']>
  author_association?: Maybe<Scalars['String']['output']>
  body?: Maybe<Scalars['String']['output']>
  closed_at?: Maybe<Scalars['timestamp']['output']>
  comments?: Maybe<Scalars['bigint']['output']>
  comments_url?: Maybe<Scalars['String']['output']>
  created_at?: Maybe<Scalars['timestamp']['output']>
  events_url?: Maybe<Scalars['String']['output']>
  html_url?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['bigint']['output']>
  labels?: Maybe<Scalars['jsonb']['output']>
  labels_url?: Maybe<Scalars['String']['output']>
  locked?: Maybe<Scalars['Boolean']['output']>
  milestone?: Maybe<Scalars['String']['output']>
  number?: Maybe<Scalars['bigint']['output']>
  program?: Maybe<Scalars['String']['output']>
  pull_request?: Maybe<Scalars['jsonb']['output']>
  repository?: Maybe<Scalars['String']['output']>
  repository_url?: Maybe<Scalars['String']['output']>
  state?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamp']['output']>
  url?: Maybe<Scalars['String']['output']>
  user?: Maybe<Scalars['String']['output']>
  user_id?: Maybe<Scalars['bigint']['output']>
}

/** columns and relationships of "logos_map_issues" */
export type Logos_Map_IssuesAssigneeArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "logos_map_issues" */
export type Logos_Map_IssuesAssigneesArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "logos_map_issues" */
export type Logos_Map_IssuesLabelsArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** columns and relationships of "logos_map_issues" */
export type Logos_Map_IssuesPull_RequestArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "logos_map_issues". All fields are combined with a logical 'AND'. */
export type Logos_Map_Issues_Bool_Exp = {
  _and?: InputMaybe<Array<Logos_Map_Issues_Bool_Exp>>
  _not?: InputMaybe<Logos_Map_Issues_Bool_Exp>
  _or?: InputMaybe<Array<Logos_Map_Issues_Bool_Exp>>
  active_lock_reason?: InputMaybe<String_Comparison_Exp>
  assignee?: InputMaybe<Jsonb_Comparison_Exp>
  assignees?: InputMaybe<Jsonb_Comparison_Exp>
  author_association?: InputMaybe<String_Comparison_Exp>
  body?: InputMaybe<String_Comparison_Exp>
  closed_at?: InputMaybe<Timestamp_Comparison_Exp>
  comments?: InputMaybe<Bigint_Comparison_Exp>
  comments_url?: InputMaybe<String_Comparison_Exp>
  created_at?: InputMaybe<Timestamp_Comparison_Exp>
  events_url?: InputMaybe<String_Comparison_Exp>
  html_url?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Bigint_Comparison_Exp>
  labels?: InputMaybe<Jsonb_Comparison_Exp>
  labels_url?: InputMaybe<String_Comparison_Exp>
  locked?: InputMaybe<Boolean_Comparison_Exp>
  milestone?: InputMaybe<String_Comparison_Exp>
  number?: InputMaybe<Bigint_Comparison_Exp>
  program?: InputMaybe<String_Comparison_Exp>
  pull_request?: InputMaybe<Jsonb_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  repository_url?: InputMaybe<String_Comparison_Exp>
  state?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamp_Comparison_Exp>
  url?: InputMaybe<String_Comparison_Exp>
  user?: InputMaybe<String_Comparison_Exp>
  user_id?: InputMaybe<Bigint_Comparison_Exp>
}

/** columns and relationships of "logos_map_issues_by_epic" */
export type Logos_Map_Issues_By_Epic = {
  __typename?: 'logos_map_issues_by_epic'
  assignee?: Maybe<Scalars['String']['output']>
  author?: Maybe<Scalars['String']['output']>
  closed_at?: Maybe<Scalars['timestamp']['output']>
  created_at?: Maybe<Scalars['timestamp']['output']>
  epic_color?: Maybe<Scalars['String']['output']>
  epic_name?: Maybe<Scalars['String']['output']>
  issue_number?: Maybe<Scalars['bigint']['output']>
  issue_url?: Maybe<Scalars['String']['output']>
  labels?: Maybe<Scalars['jsonb']['output']>
  milestone?: Maybe<Scalars['String']['output']>
  program?: Maybe<Scalars['String']['output']>
  repository?: Maybe<Scalars['String']['output']>
  stage?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
}

/** columns and relationships of "logos_map_issues_by_epic" */
export type Logos_Map_Issues_By_EpicLabelsArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "logos_map_issues_by_epic". All fields are combined with a logical 'AND'. */
export type Logos_Map_Issues_By_Epic_Bool_Exp = {
  _and?: InputMaybe<Array<Logos_Map_Issues_By_Epic_Bool_Exp>>
  _not?: InputMaybe<Logos_Map_Issues_By_Epic_Bool_Exp>
  _or?: InputMaybe<Array<Logos_Map_Issues_By_Epic_Bool_Exp>>
  assignee?: InputMaybe<String_Comparison_Exp>
  author?: InputMaybe<String_Comparison_Exp>
  closed_at?: InputMaybe<Timestamp_Comparison_Exp>
  created_at?: InputMaybe<Timestamp_Comparison_Exp>
  epic_color?: InputMaybe<String_Comparison_Exp>
  epic_name?: InputMaybe<String_Comparison_Exp>
  issue_number?: InputMaybe<Bigint_Comparison_Exp>
  issue_url?: InputMaybe<String_Comparison_Exp>
  labels?: InputMaybe<Jsonb_Comparison_Exp>
  milestone?: InputMaybe<String_Comparison_Exp>
  program?: InputMaybe<String_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  stage?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "logos_map_issues_by_epic". */
export type Logos_Map_Issues_By_Epic_Order_By = {
  assignee?: InputMaybe<Order_By>
  author?: InputMaybe<Order_By>
  closed_at?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  epic_color?: InputMaybe<Order_By>
  epic_name?: InputMaybe<Order_By>
  issue_number?: InputMaybe<Order_By>
  issue_url?: InputMaybe<Order_By>
  labels?: InputMaybe<Order_By>
  milestone?: InputMaybe<Order_By>
  program?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  stage?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
}

/** select columns of table "logos_map_issues_by_epic" */
export enum Logos_Map_Issues_By_Epic_Select_Column {
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
  Milestone = 'milestone',
  /** column name */
  Program = 'program',
  /** column name */
  Repository = 'repository',
  /** column name */
  Stage = 'stage',
  /** column name */
  Title = 'title',
}

/** Streaming cursor of the table "logos_map_issues_by_epic" */
export type Logos_Map_Issues_By_Epic_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logos_Map_Issues_By_Epic_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Logos_Map_Issues_By_Epic_Stream_Cursor_Value_Input = {
  assignee?: InputMaybe<Scalars['String']['input']>
  author?: InputMaybe<Scalars['String']['input']>
  closed_at?: InputMaybe<Scalars['timestamp']['input']>
  created_at?: InputMaybe<Scalars['timestamp']['input']>
  epic_color?: InputMaybe<Scalars['String']['input']>
  epic_name?: InputMaybe<Scalars['String']['input']>
  issue_number?: InputMaybe<Scalars['bigint']['input']>
  issue_url?: InputMaybe<Scalars['String']['input']>
  labels?: InputMaybe<Scalars['jsonb']['input']>
  milestone?: InputMaybe<Scalars['String']['input']>
  program?: InputMaybe<Scalars['String']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  stage?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
}

/** Ordering options when selecting data from "logos_map_issues". */
export type Logos_Map_Issues_Order_By = {
  active_lock_reason?: InputMaybe<Order_By>
  assignee?: InputMaybe<Order_By>
  assignees?: InputMaybe<Order_By>
  author_association?: InputMaybe<Order_By>
  body?: InputMaybe<Order_By>
  closed_at?: InputMaybe<Order_By>
  comments?: InputMaybe<Order_By>
  comments_url?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  events_url?: InputMaybe<Order_By>
  html_url?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  labels?: InputMaybe<Order_By>
  labels_url?: InputMaybe<Order_By>
  locked?: InputMaybe<Order_By>
  milestone?: InputMaybe<Order_By>
  number?: InputMaybe<Order_By>
  program?: InputMaybe<Order_By>
  pull_request?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  repository_url?: InputMaybe<Order_By>
  state?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  url?: InputMaybe<Order_By>
  user?: InputMaybe<Order_By>
  user_id?: InputMaybe<Order_By>
}

/** select columns of table "logos_map_issues" */
export enum Logos_Map_Issues_Select_Column {
  /** column name */
  ActiveLockReason = 'active_lock_reason',
  /** column name */
  Assignee = 'assignee',
  /** column name */
  Assignees = 'assignees',
  /** column name */
  AuthorAssociation = 'author_association',
  /** column name */
  Body = 'body',
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  Comments = 'comments',
  /** column name */
  CommentsUrl = 'comments_url',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EventsUrl = 'events_url',
  /** column name */
  HtmlUrl = 'html_url',
  /** column name */
  Id = 'id',
  /** column name */
  Labels = 'labels',
  /** column name */
  LabelsUrl = 'labels_url',
  /** column name */
  Locked = 'locked',
  /** column name */
  Milestone = 'milestone',
  /** column name */
  Number = 'number',
  /** column name */
  Program = 'program',
  /** column name */
  PullRequest = 'pull_request',
  /** column name */
  Repository = 'repository',
  /** column name */
  RepositoryUrl = 'repository_url',
  /** column name */
  State = 'state',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url',
  /** column name */
  User = 'user',
  /** column name */
  UserId = 'user_id',
}

/** Streaming cursor of the table "logos_map_issues" */
export type Logos_Map_Issues_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logos_Map_Issues_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Logos_Map_Issues_Stream_Cursor_Value_Input = {
  active_lock_reason?: InputMaybe<Scalars['String']['input']>
  assignee?: InputMaybe<Scalars['jsonb']['input']>
  assignees?: InputMaybe<Scalars['jsonb']['input']>
  author_association?: InputMaybe<Scalars['String']['input']>
  body?: InputMaybe<Scalars['String']['input']>
  closed_at?: InputMaybe<Scalars['timestamp']['input']>
  comments?: InputMaybe<Scalars['bigint']['input']>
  comments_url?: InputMaybe<Scalars['String']['input']>
  created_at?: InputMaybe<Scalars['timestamp']['input']>
  events_url?: InputMaybe<Scalars['String']['input']>
  html_url?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['bigint']['input']>
  labels?: InputMaybe<Scalars['jsonb']['input']>
  labels_url?: InputMaybe<Scalars['String']['input']>
  locked?: InputMaybe<Scalars['Boolean']['input']>
  milestone?: InputMaybe<Scalars['String']['input']>
  number?: InputMaybe<Scalars['bigint']['input']>
  program?: InputMaybe<Scalars['String']['input']>
  pull_request?: InputMaybe<Scalars['jsonb']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  repository_url?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamp']['input']>
  url?: InputMaybe<Scalars['String']['input']>
  user?: InputMaybe<Scalars['String']['input']>
  user_id?: InputMaybe<Scalars['bigint']['input']>
}

/** columns and relationships of "logos_map_milestones" */
export type Logos_Map_Milestones = {
  __typename?: 'logos_map_milestones'
  closed_at?: Maybe<Scalars['timestamptz']['output']>
  closed_issues?: Maybe<Scalars['bigint']['output']>
  created_at?: Maybe<Scalars['timestamptz']['output']>
  creator?: Maybe<Scalars['jsonb']['output']>
  description?: Maybe<Scalars['String']['output']>
  due_on?: Maybe<Scalars['timestamptz']['output']>
  html_url?: Maybe<Scalars['String']['output']>
  id?: Maybe<Scalars['bigint']['output']>
  labels_url?: Maybe<Scalars['String']['output']>
  node_id?: Maybe<Scalars['String']['output']>
  number?: Maybe<Scalars['bigint']['output']>
  open_issues?: Maybe<Scalars['bigint']['output']>
  program?: Maybe<Scalars['String']['output']>
  repository?: Maybe<Scalars['String']['output']>
  state?: Maybe<Scalars['String']['output']>
  title?: Maybe<Scalars['String']['output']>
  updated_at?: Maybe<Scalars['timestamptz']['output']>
  url?: Maybe<Scalars['String']['output']>
}

/** columns and relationships of "logos_map_milestones" */
export type Logos_Map_MilestonesCreatorArgs = {
  path?: InputMaybe<Scalars['String']['input']>
}

/** Boolean expression to filter rows from the table "logos_map_milestones". All fields are combined with a logical 'AND'. */
export type Logos_Map_Milestones_Bool_Exp = {
  _and?: InputMaybe<Array<Logos_Map_Milestones_Bool_Exp>>
  _not?: InputMaybe<Logos_Map_Milestones_Bool_Exp>
  _or?: InputMaybe<Array<Logos_Map_Milestones_Bool_Exp>>
  closed_at?: InputMaybe<Timestamptz_Comparison_Exp>
  closed_issues?: InputMaybe<Bigint_Comparison_Exp>
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>
  creator?: InputMaybe<Jsonb_Comparison_Exp>
  description?: InputMaybe<String_Comparison_Exp>
  due_on?: InputMaybe<Timestamptz_Comparison_Exp>
  html_url?: InputMaybe<String_Comparison_Exp>
  id?: InputMaybe<Bigint_Comparison_Exp>
  labels_url?: InputMaybe<String_Comparison_Exp>
  node_id?: InputMaybe<String_Comparison_Exp>
  number?: InputMaybe<Bigint_Comparison_Exp>
  open_issues?: InputMaybe<Bigint_Comparison_Exp>
  program?: InputMaybe<String_Comparison_Exp>
  repository?: InputMaybe<String_Comparison_Exp>
  state?: InputMaybe<String_Comparison_Exp>
  title?: InputMaybe<String_Comparison_Exp>
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>
  url?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "logos_map_milestones". */
export type Logos_Map_Milestones_Order_By = {
  closed_at?: InputMaybe<Order_By>
  closed_issues?: InputMaybe<Order_By>
  created_at?: InputMaybe<Order_By>
  creator?: InputMaybe<Order_By>
  description?: InputMaybe<Order_By>
  due_on?: InputMaybe<Order_By>
  html_url?: InputMaybe<Order_By>
  id?: InputMaybe<Order_By>
  labels_url?: InputMaybe<Order_By>
  node_id?: InputMaybe<Order_By>
  number?: InputMaybe<Order_By>
  open_issues?: InputMaybe<Order_By>
  program?: InputMaybe<Order_By>
  repository?: InputMaybe<Order_By>
  state?: InputMaybe<Order_By>
  title?: InputMaybe<Order_By>
  updated_at?: InputMaybe<Order_By>
  url?: InputMaybe<Order_By>
}

/** select columns of table "logos_map_milestones" */
export enum Logos_Map_Milestones_Select_Column {
  /** column name */
  ClosedAt = 'closed_at',
  /** column name */
  ClosedIssues = 'closed_issues',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Creator = 'creator',
  /** column name */
  Description = 'description',
  /** column name */
  DueOn = 'due_on',
  /** column name */
  HtmlUrl = 'html_url',
  /** column name */
  Id = 'id',
  /** column name */
  LabelsUrl = 'labels_url',
  /** column name */
  NodeId = 'node_id',
  /** column name */
  Number = 'number',
  /** column name */
  OpenIssues = 'open_issues',
  /** column name */
  Program = 'program',
  /** column name */
  Repository = 'repository',
  /** column name */
  State = 'state',
  /** column name */
  Title = 'title',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  Url = 'url',
}

/** Streaming cursor of the table "logos_map_milestones" */
export type Logos_Map_Milestones_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Logos_Map_Milestones_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Logos_Map_Milestones_Stream_Cursor_Value_Input = {
  closed_at?: InputMaybe<Scalars['timestamptz']['input']>
  closed_issues?: InputMaybe<Scalars['bigint']['input']>
  created_at?: InputMaybe<Scalars['timestamptz']['input']>
  creator?: InputMaybe<Scalars['jsonb']['input']>
  description?: InputMaybe<Scalars['String']['input']>
  due_on?: InputMaybe<Scalars['timestamptz']['input']>
  html_url?: InputMaybe<Scalars['String']['input']>
  id?: InputMaybe<Scalars['bigint']['input']>
  labels_url?: InputMaybe<Scalars['String']['input']>
  node_id?: InputMaybe<Scalars['String']['input']>
  number?: InputMaybe<Scalars['bigint']['input']>
  open_issues?: InputMaybe<Scalars['bigint']['input']>
  program?: InputMaybe<Scalars['String']['input']>
  repository?: InputMaybe<Scalars['String']['input']>
  state?: InputMaybe<Scalars['String']['input']>
  title?: InputMaybe<Scalars['String']['input']>
  updated_at?: InputMaybe<Scalars['timestamptz']['input']>
  url?: InputMaybe<Scalars['String']['input']>
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
  /** fetch data from the table: "epic_issues_count" */
  epic_issues_count: Array<Epic_Issues_Count>
  /** fetch data from the table: "gh_burnup" */
  gh_burnup: Array<Gh_Burnup>
  /** execute function "gh_burnup_per_epic" which returns "epic_issues_count" */
  gh_burnup_per_epic: Array<Epic_Issues_Count>
  /** fetch data from the table: "gh_epic_issues" */
  gh_epic_issues: Array<Gh_Epic_Issues>
  /** fetch data from the table: "gh_epics" */
  gh_epics: Array<Gh_Epics>
  /** fetch data from the table: "gh_issues" */
  gh_issues: Array<Gh_Issues>
  /** fetch data from the table: "gh_milestones" */
  gh_milestones: Array<Gh_Milestones>
  /** fetch data from the table: "gh_orphans" */
  gh_orphans: Array<Gh_Orphans>
  /** fetch data from the table: "gh_repositories" */
  gh_repositories: Array<Gh_Repositories>
  /** fetch data from the table: "logos_map_epics" */
  logos_map_epics: Array<Logos_Map_Epics>
  /** fetch data from the table: "logos_map_issue_labels" */
  logos_map_issue_labels: Array<Logos_Map_Issue_Labels>
  /** fetch data from the table: "logos_map_issues" */
  logos_map_issues: Array<Logos_Map_Issues>
  /** fetch data from the table: "logos_map_issues_by_epic" */
  logos_map_issues_by_epic: Array<Logos_Map_Issues_By_Epic>
  /** fetch data from the table: "logos_map_milestones" */
  logos_map_milestones: Array<Logos_Map_Milestones>
  /** fetch data from the table: "version" */
  version: Array<Version>
}

export type Query_RootEpic_Issues_CountArgs = {
  distinct_on?: InputMaybe<Array<Epic_Issues_Count_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Epic_Issues_Count_Order_By>>
  where?: InputMaybe<Epic_Issues_Count_Bool_Exp>
}

export type Query_RootGh_BurnupArgs = {
  distinct_on?: InputMaybe<Array<Gh_Burnup_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Burnup_Order_By>>
  where?: InputMaybe<Gh_Burnup_Bool_Exp>
}

export type Query_RootGh_Burnup_Per_EpicArgs = {
  args: Gh_Burnup_Per_Epic_Args
  distinct_on?: InputMaybe<Array<Epic_Issues_Count_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Epic_Issues_Count_Order_By>>
  where?: InputMaybe<Epic_Issues_Count_Bool_Exp>
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

export type Query_RootGh_MilestonesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Milestones_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Milestones_Order_By>>
  where?: InputMaybe<Gh_Milestones_Bool_Exp>
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

export type Query_RootLogos_Map_EpicsArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Epics_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Epics_Order_By>>
  where?: InputMaybe<Logos_Map_Epics_Bool_Exp>
}

export type Query_RootLogos_Map_Issue_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Issue_Labels_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Issue_Labels_Order_By>>
  where?: InputMaybe<Logos_Map_Issue_Labels_Bool_Exp>
}

export type Query_RootLogos_Map_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Issues_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Issues_Order_By>>
  where?: InputMaybe<Logos_Map_Issues_Bool_Exp>
}

export type Query_RootLogos_Map_Issues_By_EpicArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Issues_By_Epic_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Issues_By_Epic_Order_By>>
  where?: InputMaybe<Logos_Map_Issues_By_Epic_Bool_Exp>
}

export type Query_RootLogos_Map_MilestonesArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Milestones_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Milestones_Order_By>>
  where?: InputMaybe<Logos_Map_Milestones_Bool_Exp>
}

export type Query_RootVersionArgs = {
  distinct_on?: InputMaybe<Array<Version_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Version_Order_By>>
  where?: InputMaybe<Version_Bool_Exp>
}

export type Subscription_Root = {
  __typename?: 'subscription_root'
  /** fetch data from the table: "epic_issues_count" */
  epic_issues_count: Array<Epic_Issues_Count>
  /** fetch data from the table in a streaming manner: "epic_issues_count" */
  epic_issues_count_stream: Array<Epic_Issues_Count>
  /** fetch data from the table: "gh_burnup" */
  gh_burnup: Array<Gh_Burnup>
  /** execute function "gh_burnup_per_epic" which returns "epic_issues_count" */
  gh_burnup_per_epic: Array<Epic_Issues_Count>
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
  /** fetch data from the table: "gh_milestones" */
  gh_milestones: Array<Gh_Milestones>
  /** fetch data from the table in a streaming manner: "gh_milestones" */
  gh_milestones_stream: Array<Gh_Milestones>
  /** fetch data from the table: "gh_orphans" */
  gh_orphans: Array<Gh_Orphans>
  /** fetch data from the table in a streaming manner: "gh_orphans" */
  gh_orphans_stream: Array<Gh_Orphans>
  /** fetch data from the table: "gh_repositories" */
  gh_repositories: Array<Gh_Repositories>
  /** fetch data from the table in a streaming manner: "gh_repositories" */
  gh_repositories_stream: Array<Gh_Repositories>
  /** fetch data from the table: "logos_map_epics" */
  logos_map_epics: Array<Logos_Map_Epics>
  /** fetch data from the table in a streaming manner: "logos_map_epics" */
  logos_map_epics_stream: Array<Logos_Map_Epics>
  /** fetch data from the table: "logos_map_issue_labels" */
  logos_map_issue_labels: Array<Logos_Map_Issue_Labels>
  /** fetch data from the table in a streaming manner: "logos_map_issue_labels" */
  logos_map_issue_labels_stream: Array<Logos_Map_Issue_Labels>
  /** fetch data from the table: "logos_map_issues" */
  logos_map_issues: Array<Logos_Map_Issues>
  /** fetch data from the table: "logos_map_issues_by_epic" */
  logos_map_issues_by_epic: Array<Logos_Map_Issues_By_Epic>
  /** fetch data from the table in a streaming manner: "logos_map_issues_by_epic" */
  logos_map_issues_by_epic_stream: Array<Logos_Map_Issues_By_Epic>
  /** fetch data from the table in a streaming manner: "logos_map_issues" */
  logos_map_issues_stream: Array<Logos_Map_Issues>
  /** fetch data from the table: "logos_map_milestones" */
  logos_map_milestones: Array<Logos_Map_Milestones>
  /** fetch data from the table in a streaming manner: "logos_map_milestones" */
  logos_map_milestones_stream: Array<Logos_Map_Milestones>
  /** fetch data from the table: "version" */
  version: Array<Version>
  /** fetch data from the table in a streaming manner: "version" */
  version_stream: Array<Version>
}

export type Subscription_RootEpic_Issues_CountArgs = {
  distinct_on?: InputMaybe<Array<Epic_Issues_Count_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Epic_Issues_Count_Order_By>>
  where?: InputMaybe<Epic_Issues_Count_Bool_Exp>
}

export type Subscription_RootEpic_Issues_Count_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Epic_Issues_Count_Stream_Cursor_Input>>
  where?: InputMaybe<Epic_Issues_Count_Bool_Exp>
}

export type Subscription_RootGh_BurnupArgs = {
  distinct_on?: InputMaybe<Array<Gh_Burnup_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Burnup_Order_By>>
  where?: InputMaybe<Gh_Burnup_Bool_Exp>
}

export type Subscription_RootGh_Burnup_Per_EpicArgs = {
  args: Gh_Burnup_Per_Epic_Args
  distinct_on?: InputMaybe<Array<Epic_Issues_Count_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Epic_Issues_Count_Order_By>>
  where?: InputMaybe<Epic_Issues_Count_Bool_Exp>
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

export type Subscription_RootGh_MilestonesArgs = {
  distinct_on?: InputMaybe<Array<Gh_Milestones_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Gh_Milestones_Order_By>>
  where?: InputMaybe<Gh_Milestones_Bool_Exp>
}

export type Subscription_RootGh_Milestones_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Gh_Milestones_Stream_Cursor_Input>>
  where?: InputMaybe<Gh_Milestones_Bool_Exp>
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

export type Subscription_RootLogos_Map_EpicsArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Epics_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Epics_Order_By>>
  where?: InputMaybe<Logos_Map_Epics_Bool_Exp>
}

export type Subscription_RootLogos_Map_Epics_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Logos_Map_Epics_Stream_Cursor_Input>>
  where?: InputMaybe<Logos_Map_Epics_Bool_Exp>
}

export type Subscription_RootLogos_Map_Issue_LabelsArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Issue_Labels_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Issue_Labels_Order_By>>
  where?: InputMaybe<Logos_Map_Issue_Labels_Bool_Exp>
}

export type Subscription_RootLogos_Map_Issue_Labels_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Logos_Map_Issue_Labels_Stream_Cursor_Input>>
  where?: InputMaybe<Logos_Map_Issue_Labels_Bool_Exp>
}

export type Subscription_RootLogos_Map_IssuesArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Issues_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Issues_Order_By>>
  where?: InputMaybe<Logos_Map_Issues_Bool_Exp>
}

export type Subscription_RootLogos_Map_Issues_By_EpicArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Issues_By_Epic_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Issues_By_Epic_Order_By>>
  where?: InputMaybe<Logos_Map_Issues_By_Epic_Bool_Exp>
}

export type Subscription_RootLogos_Map_Issues_By_Epic_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Logos_Map_Issues_By_Epic_Stream_Cursor_Input>>
  where?: InputMaybe<Logos_Map_Issues_By_Epic_Bool_Exp>
}

export type Subscription_RootLogos_Map_Issues_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Logos_Map_Issues_Stream_Cursor_Input>>
  where?: InputMaybe<Logos_Map_Issues_Bool_Exp>
}

export type Subscription_RootLogos_Map_MilestonesArgs = {
  distinct_on?: InputMaybe<Array<Logos_Map_Milestones_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Logos_Map_Milestones_Order_By>>
  where?: InputMaybe<Logos_Map_Milestones_Bool_Exp>
}

export type Subscription_RootLogos_Map_Milestones_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Logos_Map_Milestones_Stream_Cursor_Input>>
  where?: InputMaybe<Logos_Map_Milestones_Bool_Exp>
}

export type Subscription_RootVersionArgs = {
  distinct_on?: InputMaybe<Array<Version_Select_Column>>
  limit?: InputMaybe<Scalars['Int']['input']>
  offset?: InputMaybe<Scalars['Int']['input']>
  order_by?: InputMaybe<Array<Version_Order_By>>
  where?: InputMaybe<Version_Bool_Exp>
}

export type Subscription_RootVersion_StreamArgs = {
  batch_size: Scalars['Int']['input']
  cursor: Array<InputMaybe<Version_Stream_Cursor_Input>>
  where?: InputMaybe<Version_Bool_Exp>
}

/** Boolean expression to compare columns of type "timestamp". All fields are combined with logical 'AND'. */
export type Timestamp_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamp']['input']>
  _gt?: InputMaybe<Scalars['timestamp']['input']>
  _gte?: InputMaybe<Scalars['timestamp']['input']>
  _in?: InputMaybe<Array<Scalars['timestamp']['input']>>
  _is_null?: InputMaybe<Scalars['Boolean']['input']>
  _lt?: InputMaybe<Scalars['timestamp']['input']>
  _lte?: InputMaybe<Scalars['timestamp']['input']>
  _neq?: InputMaybe<Scalars['timestamp']['input']>
  _nin?: InputMaybe<Array<Scalars['timestamp']['input']>>
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

/** columns and relationships of "version" */
export type Version = {
  __typename?: 'version'
  version?: Maybe<Scalars['String']['output']>
}

/** Boolean expression to filter rows from the table "version". All fields are combined with a logical 'AND'. */
export type Version_Bool_Exp = {
  _and?: InputMaybe<Array<Version_Bool_Exp>>
  _not?: InputMaybe<Version_Bool_Exp>
  _or?: InputMaybe<Array<Version_Bool_Exp>>
  version?: InputMaybe<String_Comparison_Exp>
}

/** Ordering options when selecting data from "version". */
export type Version_Order_By = {
  version?: InputMaybe<Order_By>
}

/** select columns of table "version" */
export enum Version_Select_Column {
  /** column name */
  Version = 'version',
}

/** Streaming cursor of the table "version" */
export type Version_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Version_Stream_Cursor_Value_Input
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>
}

/** Initial value of the column from where the streaming should start */
export type Version_Stream_Cursor_Value_Input = {
  version?: InputMaybe<Scalars['String']['input']>
}
