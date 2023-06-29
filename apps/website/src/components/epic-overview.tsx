import { Tag, Text } from '@status-im/components'
import { OpenIcon } from '@status-im/icons'

import { Chart } from './chart/chart'
import { DatePicker } from './datepicker/datepicker'

import type { GetBurnupQuery } from '@/lib/graphql/generated/operations'
import type { DateRange } from '@status-im/components/src/calendar/calendar'

type Props = {
  title: string
  description?: string
  color?: `#${string}`
  fullscreen?: boolean
  isLoading?: boolean
  burnup?: GetBurnupQuery['gh_burnup']
  selectedDates?: DateRange
  setSelectedDates: (date?: DateRange) => void
  showPicker?: boolean
}

export const EpicOverview = (props: Props) => {
  const {
    title,
    description,
    color,
    fullscreen,
    isLoading,
    burnup,
    selectedDates,
    setSelectedDates,
    showPicker = true,
  } = props

  console.log('isLoading', isLoading)
  const filteredData = burnup?.reduce(
    (
      accumulator: {
        date: string
        open_issues: number
        closed_issues: number
      }[],
      current: GetBurnupQuery['gh_burnup'][0]
    ) => {
      const existingItem = accumulator.find(
        item => item.date === current.date_field
      )
      if (!existingItem) {
        accumulator.push({
          date: current?.date_field,
          open_issues:
            current?.total_opened_issues - current?.total_closed_issues,
          closed_issues: current?.total_closed_issues,
        })
      }

      return accumulator
    },
    []
  )

  return (
    <div style={{ position: 'relative' }}>
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          <Text size={fullscreen ? 27 : 19} weight="semibold">
            {title}
          </Text>
          <OpenIcon size={20} />
        </div>
        {showPicker && (
          <DatePicker selected={selectedDates} onSelect={setSelectedDates} />
        )}
      </div>
      {Boolean(description) && (
        <Text size={fullscreen ? 19 : 15} color="$neutral-50">
          {description}
        </Text>
      )}

      <div className="flex py-3">
        <Tag size={24} label={title} color={color} />
      </div>

      <Chart data={filteredData || []} height={300} isLoading={isLoading} />

      {/* TODO - Add theses when we have milestones and/or labels */}
      {/* <div className="flex justify-between pt-3">
        <div className="flex gap-1">
          <Tag size={24} label="Communities" color="#FF7D46" icon="🧙‍♂️" />
          <Tag size={24} label="Wallet" color="#7140FD" icon="🎎" />
        </div>

       
        <div className="flex gap-1">
          <Tag size={24} label="M:0.11.0" color="$danger-50" />
          <Tag size={24} label="M:0.12.0" color="$success-50" />
        </div>
      </div> */}
    </div>
  )
}
