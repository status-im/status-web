import { useMemo } from 'react'

import { cx } from 'class-variance-authority'

import { groupBy } from '~/utils/group-by'

import { InsightsAppIcon } from '../../_components/insights-app-icon'
import { StatusGroupList } from '../../_components/status-group-list'

import type { ApiOutput } from '~server/api/types'

type Props = {
  projects: ApiOutput['workstreams']['all'][number]['projects']
  cardAction?: ProjectCardProps['action']
}

const GROUPS = ['not-started', 'paused', 'in-progress', 'done'] as const

export const ProjectsStatusGroupList = (props: Props) => {
  const { projects, cardAction } = props

  const projectsByStatus = useMemo(() => {
    return groupBy(projects, project => project.status, {
      'not-started': [],
      'in-progress': [],
      done: [],
      paused: [],
    })
  }, [projects])

  return (
    <StatusGroupList>
      {GROUPS.map(status => {
        if (projectsByStatus[status].length === 0) {
          return null
        }

        return (
          <StatusGroupList.Item key={status} status={status}>
            {projectsByStatus[status].map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                action={cardAction}
              />
            ))}
          </StatusGroupList.Item>
        )
      })}
    </StatusGroupList>
  )
}

type ProjectCardProps = {
  project: ApiOutput['projects']['all'][number]
  action?: (project: ProjectCardProps['project']) => React.ReactNode
}

const ProjectCard = (props: ProjectCardProps) => {
  const { project, action } = props

  return (
    <div
      className={cx([
        'relative rounded-16 border border-neutral-20 bg-white-100 p-3',
        project.status === 'done' && 'bg-neutral-5',
      ])}
    >
      <div className="mb-2 flex flex-1 justify-between gap-3">
        <div className="grid gap-0.5">
          <div className="text-13 font-medium">{project.name}</div>
          <div className="text-13 font-regular">{project.description}</div>
        </div>
        {action?.(project)}
      </div>
      <div className="flex items-center gap-1 text-13 font-medium capitalize">
        <InsightsAppIcon type={project.app} />
        {project.app}
      </div>
    </div>
  )
}
