import { Calendar } from '@status-im/components/src/calendar/calendar'
import { Popover } from '@status-im/components/src/popover'
import { EditIcon } from '@status-im/icons'

import { formatDate } from '../chart/utils/format-time'

import type { DateRange } from '@status-im/components/src/calendar/calendar'

type Props = {
  selected?: DateRange
  onSelect: (selected?: DateRange) => void
}

const DatePicker = (props: Props) => {
  const { selected, onSelect } = props

  return (
    <div className="sticky bottom-5 flex justify-center">
      <Popover alignOffset={8} align="center" sideOffset={8}>
        <button className="active inline-flex min-h-[30px] cursor-pointer items-center justify-center gap-2 rounded-xl border-solid border-neutral-80/5 bg-blur-neutral-5/70 pl-3 pr-2 uppercase text-neutral-100 backdrop-blur-sm">
          <span className="text-[13px] font-medium text-blur-neutral-80/80">
            Filter between
          </span>
          <span className="text-[13px] font-medium text-neutral-100">
            {`${selected?.from ? formatDate(selected.from) : 'Start Date'} → ${
              selected?.to ? formatDate(selected.to) : 'End Date'
            }`}
          </span>
          <div className="h-full w-[1px] bg-neutral-80/5" />
          <EditIcon size={20} color="$neutral-80-opa-40" />
        </button>
        <Popover.Content>
          <Calendar
            mode="range"
            selected={selected}
            onSelect={onSelect}
            fixedWeeks
          />
        </Popover.Content>
      </Popover>
    </div>
  )
}

export { DatePicker }
