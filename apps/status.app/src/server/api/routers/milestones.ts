import { groupBy } from '~/utils/group-by'

import type { InferQueryModel } from '~server/db/types'

export function getMilestoneStatus(
  epics: Array<
    InferQueryModel<'Epics', { columns: { id: true; status: true } }>
  >
): 'done' | 'in-progress' | 'paused' | 'not-started' {
  const epicsByStatus = groupBy(epics, e => e.status, {
    done: [],
    'in-progress': [],
    'not-started': [],
  })

  if (epics.length === 0) {
    return 'not-started'
  }

  if (epicsByStatus['done'].length === epics.length) {
    return 'done'
  }

  if (epicsByStatus['in-progress'].length > 0) {
    return 'in-progress'
  }

  if (
    epicsByStatus['not-started'].length > 0 &&
    epicsByStatus['done'].length > 0
  ) {
    return 'paused'
  }

  return 'not-started'
}

export function mapMilestone(
  milestone: InferQueryModel<
    'Milestones',
    {
      columns: {
        id: true
        name: true
        description: true
        position: true
      }
      with: {
        project: {
          columns: {
            id: true
            app: true
            name: true
          }
        }
        epics: {
          columns: Record<string, never>
          with: {
            epic: {
              columns: {
                id: true
                status: true
                name: true
                color: true
              }
            }
          }
        }
      }
    }
  >
) {
  const epics = milestone.epics.map(({ epic }) => epic)

  return {
    ...milestone,
    status: getMilestoneStatus(epics),
    epics,
  }
}
