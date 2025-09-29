import { cx } from 'class-variance-authority'

import { InsightsStatusIcon } from '~admin/insights/_components/insights-status-icon'

import { SelectionIndicator } from '../../../_components/selection-indicator'

import type { ApiOutput } from '~server/api/types'

type Props = {
  selected: boolean
  onSelect: (id: number) => void
  onRemove: (id: number) => void
  milestone: ApiOutput['projects']['all'][0]['milestones'][0]
}

const MilestoneItem = (props: Props) => {
  const { selected, onSelect, onRemove, milestone } = props

  return (
    <button
      key={milestone.id}
      type="button"
      className={cx([
        'flex flex-row gap-2 rounded-16 border p-3 text-left hover:border-neutral-30',
        selected
          ? 'border-customisation-blue-50/20 bg-customisation-blue-50/5'
          : 'border-neutral-10',
      ])}
      onClick={() => {
        if (selected) {
          onRemove(milestone.id)
        } else {
          onSelect(milestone.id)
        }
      }}
    >
      <InsightsStatusIcon status={milestone.status} />
      <div className="flex flex-1 flex-col gap-0 text-13">
        <span className="font-medium">{milestone.name}</span>
        <span>{milestone.description}</span>
      </div>
      <div className="items-end">
        <SelectionIndicator selected={selected} />
      </div>
    </button>
  )
}

export { MilestoneItem }
