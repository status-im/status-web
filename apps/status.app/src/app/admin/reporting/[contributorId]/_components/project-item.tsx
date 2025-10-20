import { InsightsAppIcon } from '~admin/insights/_components/insights-app-icon'

import { MilestoneItem } from './milestone-item'

import type { ApiOutput } from '~server/api/types'

type Props = {
  app: ApiOutput['projects']['byId']['app']
  title: string
  milestones: ApiOutput['projects']['all'][0]['milestones']
  selection: number[]
  onSelect: (id: number) => void
  onRemove: (id: number) => void
}

const ProjectItem = (props: Props) => {
  const { app, title, milestones, selection, onSelect, onRemove } = props

  return (
    <div className="flex flex-col gap-2 pb-4">
      <div className="flex gap-1 pb-1 pt-4 text-13 font-medium text-neutral-100">
        <InsightsAppIcon type={app} /> {title}
      </div>
      {milestones.map(milestone => {
        return (
          <MilestoneItem
            key={milestone.id}
            milestone={milestone}
            selected={selection.includes(milestone.id)}
            onSelect={onSelect}
            onRemove={onRemove}
          />
        )
      })}
    </div>
  )
}

export { ProjectItem }
