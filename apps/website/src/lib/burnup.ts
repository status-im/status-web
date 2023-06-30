export const GET_BURNUP = /* GraphQL */ `
  query getBurnup($epicNames: [String!], $from: timestamptz, $to: timestamptz) {
    gh_burnup(
      where: {
        epic_name: { _in: $epicNames }
        _or: [
          {
            _and: [
              { date_field: { _gte: $from } }
              { date_field: { _lt: $to } }
            ]
          }
          {
            _and: [
              { date_field: { _gt: $from } }
              { date_field: { _lte: $to } }
            ]
          }
        ]
      }
      order_by: { date_field: asc }
    ) {
      epic_name
      total_closed_issues
      total_opened_issues
      date_field
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
