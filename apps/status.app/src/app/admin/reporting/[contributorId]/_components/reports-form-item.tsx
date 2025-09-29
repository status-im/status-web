import { IconButton } from '@status-im/components'
import { DeleteIcon } from '@status-im/icons/16'
import { TimeOffIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import { InsightsAppIcon } from '~admin/insights/_components/insights-app-icon'

import type { ModifiedMilestone } from './reports-form'

type ReportsFormItemMilestone = {
  milestone: ModifiedMilestone
  type: 'milestone'
}

type ReportsFormItemTimeOff = {
  type: 'timeOff'
}

type Props = {
  id: string
  name: string
  onRemove: () => void
} & (ReportsFormItemMilestone | ReportsFormItemTimeOff)

const ReportsFormItem = (props: Props) => {
  const { id, name, onRemove, type } = props

  const { field, fieldState } = useController({ name })

  const renderLabels = () => {
    switch (type) {
      case 'milestone':
        return (
          <ReportsFormItemLabel
            label={props.milestone.name}
            description={props.milestone.projectName}
            icon={<InsightsAppIcon type={props.milestone.app} />}
          />
        )
      case 'timeOff':
        return (
          <ReportsFormItemLabel
            label="Time Off"
            description="Member has been OOO"
            icon={<TimeOffIcon className="text-neutral-50" />}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="flex rounded-16 border border-neutral-10">
      <div className="flex flex-1 flex-col gap-0 p-3 text-13 font-medium text-neutral-100">
        {renderLabels()}
      </div>
      <div className="flex gap-2 px-3 py-[14px]">
        <div className="relative">
          <input
            key={id}
            placeholder="40"
            maxLength={3}
            type="text"
            data-invalid={Boolean(fieldState.error)}
            className={cx(
              // input has to have at least 16px font size to prevent from "zooming in" on mobile
              'relative top-px box-border h-8 w-[66px] rounded-12 border border-solid py-[5px] pl-2 pr-6 text-right text-15 font-medium placeholder:font-regular max-sm:text-[1rem]',
              'border-neutral-30 data-[invalid=true]:border-danger-50 focus:border-neutral-40'
            )}
            {...field}
            onChange={e => {
              if (e.target.value.trim() === '') {
                field.onChange(0)
                return
              }
              const value = parseInt(e.target.value, 10)
              if (isNaN(value)) return
              field.onChange(value)
            }}
          />
          <span className="absolute right-[9px] top-1/2 -translate-y-1/2 text-[16px] text-neutral-40">
            %
          </span>
        </div>
        <IconButton
          onPress={onRemove}
          variant="ghost"
          icon={<DeleteIcon color="text-danger-50" />}
        />
      </div>
    </div>
  )
}

type ReportsFormItemLabelProps = {
  label: string
  description: string
  icon: React.ReactNode
}

const ReportsFormItemLabel = (props: ReportsFormItemLabelProps) => {
  const { label, description, icon } = props

  return (
    <>
      <span>{label}</span>
      <span className="flex items-center gap-2">
        {icon}
        {description}
      </span>
    </>
  )
}

export { ReportsFormItem }
