import { api } from '~website/insights/_graphql'
import { Order_By } from '~website/insights/_graphql/generated/schemas'

import type {
  MilestonesQuery,
  MilestonesQueryVariables,
} from '~website/insights/_graphql/generated/operations'

const MILESTONES_QUERY = /* GraphQL */ `
  query Milestones(
    $where: gh_milestones_bool_exp
    $orderBy: [gh_milestones_order_by!]
  ) {
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

export type GitHubMilestone = {
  id: number
  number: number
  created_at: string
  due_on: string
  title: string
  repository: string
  html_url: string
  description: string
}

export async function getMilestones() {
  const { gh_milestones } = await api<
    MilestonesQuery,
    MilestonesQueryVariables
  >(MILESTONES_QUERY, {
    where: {
      state: {
        _eq: 'open',
      },
      _or: [
        {
          repository: {
            _eq: 'status-im/status-mobile',
          },
        },
        {
          repository: {
            _eq: 'status-im/status-desktop',
          },
        },
      ],
    },
    orderBy: [
      {
        created_at: Order_By.Desc,
      },
    ],
  })

  return gh_milestones as GitHubMilestone[]
}

export async function getMilestone(id: number) {
  const { gh_milestones } = await api<
    MilestonesQuery,
    MilestonesQueryVariables
  >(MILESTONES_QUERY, {
    where: {
      state: {
        _eq: 'open',
      },
      id: {
        _eq: id,
      },
    },
  })

  return gh_milestones[0] as GitHubMilestone | undefined
}
