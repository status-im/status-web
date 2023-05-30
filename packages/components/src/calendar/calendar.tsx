import './calendar.css'

import { DayPicker } from 'react-day-picker'

import { Shadow } from '../shadow'
import { CustomCaption } from './components/caption'
import { CustomRow } from './components/row'

import type { DateRange, DayPickerProps } from 'react-day-picker'

type Props = DayPickerProps

const Calendar = (props: Props): JSX.Element => {
  return (
    <Shadow
      borderWidth={1}
      borderColor="$neutral-10"
      borderRadius="$12"
      display="inline-flex"
    >
      <DayPicker
        {...props}
        showOutsideDays
        components={{
          Row: CustomRow,
          Caption: CustomCaption,
        }}
      />
    </Shadow>
  )
}

export { Calendar }
export type { Props as CalendarProps, DateRange }
