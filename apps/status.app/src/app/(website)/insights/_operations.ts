export const GET_BURNUP = /* GraphQL */ `
  query getBurnupPerEpic($epicName: String!, $from: date, $to: date) {
    gh_burnup_per_epic(
      args: { epic_name: $epicName, start: $from, finish: $to }
      order_by: { date: asc }
      where: { epic_name: { _eq: $epicName } }
    ) {
      epic_name
      total_closed
      total_opened
      date
    }
  }
`

export const GET_ISSUES_BY_EPIC = /* GraphQL */ `
  query getIssuesByEpic(
    $where: gh_epic_issues_bool_exp!
    $limit: Int!
    $offset: Int!
    $orderBy: order_by
  ) {
    gh_epic_issues(
      where: $where
      order_by: { created_at: $orderBy }
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

export const GET_EPIC_ISSUES_COUNT = /* GraphQL */ `
  query getEpicIssuesCount($where: gh_epic_issues_bool_exp!) {
    gh_epic_issues(where: $where) {
      closed_at
    }
  }
`

export const GET_FILTERS_WITH_EPIC = /* GraphQL */ `
  query getFiltersWithEpic($epicName: String!) {
    authors: gh_epic_issues(
      where: { epic_name: { _eq: $epicName }, author: { _is_null: false } }
      distinct_on: author
    ) {
      author
    }
    assignees: gh_epic_issues(
      where: { epic_name: { _eq: $epicName }, assignee: { _is_null: false } }
      distinct_on: assignee
    ) {
      assignee
    }
    repos: gh_epic_issues(
      where: { epic_name: { _eq: $epicName } }
      distinct_on: repository
    ) {
      repository
    }
  }
`

export const GET_EPIC_LINKS = /* GraphQL */ `
  query getEpicMenuLinks(
    $where: gh_epics_bool_exp
    $orderBy: [gh_epics_order_by!]
    $limit: Int
    $offset: Int
  ) {
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

export const GET_REPOS = /* GraphQL */ `
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

export const GET_ORPHANS = /* GraphQL */ `
  query getOrphans(
    $where: gh_orphans_bool_exp!
    $limit: Int!
    $offset: Int!
    $orderBy: order_by
  ) {
    gh_orphans(
      where: $where
      order_by: { created_at: $orderBy }
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

export const GET_ORPHANS_COUNT = /* GraphQL */ `
  query getOrphansCount($where: gh_orphans_bool_exp!) {
    gh_orphans(where: $where) {
      closed_at
    }
  }
`

export const GET_FILTERS_FOR_ORPHANS = /* GraphQL */ `
  query getFiltersForOrphans {
    authors: gh_orphans(
      where: { author: { _is_null: false } }
      distinct_on: author
    ) {
      author
    }
    assignees: gh_orphans(
      where: { assignee: { _is_null: false } }
      distinct_on: assignee
    ) {
      assignee
    }
    repos: gh_orphans(distinct_on: repository) {
      repository
    }
  }
`

export const GET_INITIAL_DATE_PER_EPIC = /* GraphQL */ `
  query getInitialDatePerEpic($epicName: String!) {
    gh_epic_issues(
      where: { epic_name: { _eq: $epicName } }
      order_by: { created_at: asc }
      limit: 1
    ) {
      created_at
    }
  }
`
