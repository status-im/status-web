'use client'

import { cva } from 'class-variance-authority'
import { match } from 'ts-pattern'

import { groupBy } from '~/utils/group-by'
import { Table } from '~components/table'

import { InsightsAppIcon } from './insights-app-icon'
import { StatusGroupList } from './status-group-list'

import type { ApiOutput } from '~server/api/types'

type Props = {
  milestones: ApiOutput['projects']['byId']['milestones']
  cardFooterType: MilestoneCardProps['footerType']
  cardAction?: MilestoneCardProps['action']
}

const GROUPS = ['not-started', 'paused', 'in-progress', 'done'] as const

export const MilestonesStatusGroupList = (props: Props) => {
  const { milestones, cardFooterType, cardAction } = props

  const milestonesByStatus = groupBy(milestones, m => m.status, {
    done: [],
    'in-progress': [],
    'not-started': [],
    paused: [],
  })

  if (milestones.length === 0) {
    return null
  }

  return (
    <StatusGroupList>
      {GROUPS.map(status => {
        if (milestonesByStatus[status].length === 0) {
          return null
        }

        return (
          <StatusGroupList.Item key={status} status={status}>
            {milestonesByStatus[status].map(milestone => (
              <MilestoneCard
                key={milestone.id}
                milestone={milestone}
                status={status}
                footerType={cardFooterType}
                action={cardAction}
              />
            ))}
          </StatusGroupList.Item>
        )
      })}
    </StatusGroupList>
  )
}

type MilestoneCardProps = {
  milestone: ApiOutput['projects']['byId']['milestones'][0]
  footerType: 'epics' | 'project'
  status?: 'not-started' | 'in-progress' | 'done' | 'paused'
  action?: (milestone: MilestoneCardProps['milestone']) => React.ReactNode
}

const styles = cva(
  [
    'select-none rounded-16 border border-neutral-20 bg-white-100 p-3 pt-[10px] transition duration-100',
    'aria-selected:border-customisation-blue-50/20 aria-selected:bg-customisation-blue-50/5',
  ],
  {
    variants: {
      status: {
        'not-started': 'bg-white-100',
        'in-progress': 'bg-white-100',
        paused: 'border-neutral-20 bg-neutral-5',
        done: 'border-neutral-20 bg-neutral-5',
      },
    },
  }
)

const MilestoneCard = (props: MilestoneCardProps) => {
  const { milestone, status, footerType, action } = props

  return (
    <div className={styles({ status })}>
      <div className="flex flex-1 justify-between">
        <div className="flex flex-1 flex-col items-start gap-0.5">
          <p className="text-13 font-medium">{milestone.name}</p>
          <p className="text-13 text-neutral-50">{milestone.description}</p>
        </div>
        {action?.(milestone)}
      </div>

      <div className="pt-2">
        {match(footerType)
          .with('epics', () => (
            <div className="flex flex-wrap gap-1">
              {/* todo?: It feels a bit weird to use this element here because of it's connection with the table although it should be a separate component in my opinion and then import into Table. */}
              <Table.Tags tags={milestone.epics || []} numberOfTags={3} />
            </div>
          ))
          .with('project', () => (
            <div className="flex items-center gap-1">
              <InsightsAppIcon type={milestone.project.app} />
              <p className="text-13 font-medium capitalize">
                {milestone.project.name}
              </p>
            </div>
          ))
          .exhaustive()}
      </div>
    </div>
  )
}
