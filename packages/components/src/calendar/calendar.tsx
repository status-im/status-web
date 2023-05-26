import './calendar.css'

import { ChevronLeftIcon, ChevronRightIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import { format, getUnixTime, isEqual } from 'date-fns'
import { Day, DayPicker, useDayPicker, useNavigation } from 'react-day-picker'

import { IconButton } from '../icon-button'
import { Shadow } from '../shadow'

import type {
  CaptionProps,
  DateRange,
  DayPickerProps,
  RowProps,
} from 'react-day-picker'

function CustomCaption(props: CaptionProps) {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  return (
    <div className="rdp-nav">
      <div className="rdp-caption">
        <div
          className="rdp-caption_label"
          aria-live="polite"
          role="presentation"
          id="react-day-picker-56"
        >
          {format(props.displayMonth, 'MMM yyy')}
        </div>

        <Stack flexDirection="row">
          <IconButton
            variant="ghost"
            aria-label="Go to previous month"
            icon={<ChevronLeftIcon size={20} />}
            disabled={!previousMonth}
            onPress={() => previousMonth && goToMonth(previousMonth)}
          />
          <IconButton
            variant="ghost"
            aria-label="Go to next month"
            icon={<ChevronRightIcon size={20} />}
            disabled={!nextMonth}
            onPress={() => nextMonth && goToMonth(nextMonth)}
          />
        </Stack>
      </div>
    </div>
  )
}

function CustomRow(props: RowProps): JSX.Element {
  const { styles, classNames, components, selected } = useDayPicker()

  const DayComponent = components?.Day ?? Day

  const castSelected = selected as DateRange

  return (
    <tr className={classNames.row} style={styles.row}>
      {props.dates.map(date => {
        const isSelectedStartDate =
          castSelected?.from && isEqual(date, castSelected.from)
        const isSelectedEndDate =
          castSelected?.to && isEqual(date, castSelected.to)

        const cellClassNames = () => {
          if (isSelectedStartDate) {
            return classNames.cell + ' ' + 'rdp-cell_selected_start'
          }
          if (isSelectedEndDate) {
            return classNames.cell + ' ' + 'rdp-cell_selected_end'
          }

          if (
            castSelected?.from &&
            castSelected?.to &&
            date > castSelected.from &&
            date < castSelected.to
          ) {
            return classNames.cell + ' ' + 'rdp-cell_selected_range'
          }

          return classNames.cell
        }
        return (
          <td
            className={cellClassNames()}
            style={styles.cell}
            key={getUnixTime(date)}
            role="presentation"
          >
            <DayComponent displayMonth={props.displayMonth} date={date} />
          </td>
        )
      })}
    </tr>
  )
}

type Props = DayPickerProps

const Calendar = (props: Props) => {
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
