import './calendar.css'

import { DayPicker } from 'react-day-picker'

import { CustomCaption } from './caption'
import { CustomRow } from './row'

import type { DateRange, DayPickerProps } from 'react-day-picker'

type Props = DayPickerProps

export const Calendar = (props: Props) => {
  return (
    <div className="inline-flex rounded-12 border border-neutral-10 shadow-1">
      <DayPicker
        {...props}
        showOutsideDays
        components={{
          Row: CustomRow,
          Caption: CustomCaption,
        }}
      />
    </div>
  )
}

export type { DateRange }
