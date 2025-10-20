import { getUnixTime, isEqual } from 'date-fns'
import { Day, useDayPicker } from 'react-day-picker'

import type { DateRange, RowProps } from 'react-day-picker'

const CustomRow = (props: RowProps) => {
  const { styles, classNames, selected } = useDayPicker()

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
          >
            <Day displayMonth={props.displayMonth} date={date} />
          </td>
        )
      })}
    </tr>
  )
}

export { CustomRow }
