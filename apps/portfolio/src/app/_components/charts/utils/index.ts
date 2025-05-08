import {
  addDays,
  differenceInCalendarDays,
  differenceInCalendarMonths,
  isSameMonth,
} from 'date-fns'

export const TIME_FRAMES = ['24H', '7D', '1M', '3M', '1Y', '2Y', 'All'] as const
export type TimeFrame = '24H' | '7D' | '1M' | '3M' | '1Y' | '2Y' | 'All'

type Props = {
  date: Date
  firstDate: Date
  index: number
  variant: TimeFrame
}
export const checkDateOutput = (
  props: Props
): 'bullet' | 'month' | 'day' | 'hour' | 'empty' => {
  const { date, firstDate, index, variant } = props

  const dayOfMonth = date.getDate()
  const isFirstDayOfMonth = dayOfMonth === 1
  const isFirstDataPoint = index === 0

  // Check if it's the same month as the first date in the array
  // If it's not, we reset the interval count
  const shouldResetInterval = !isSameMonth(date, firstDate)

  // If the type is day we need to return hour but we only return 7 points max (3 hours interval) otherwise we return empty string
  if (variant === '24H') {
    if (index % 4 === 0) {
      return 'hour'
    }
    return 'empty'
  }

  if (variant === '7D') {
    // For week variant we always return the day
    return 'day'
  }

  if (variant === '2Y' || variant === 'All' || variant === '1Y') {
    // if it's the first data point, we return the month and the it will interpolated with bullet
    if (isFirstDataPoint) {
      return 'month'
    }

    // Calculate the number of months from the first date
    const monthInterval = 2
    const monthsFromReference = differenceInCalendarMonths(date, firstDate)

    // Return a bullet for all other cases
    return monthsFromReference % monthInterval === 0 ? 'month' : 'bullet'
  }

  // Calculate the number of days from the first date or the first of the month
  const daysFromReference = shouldResetInterval
    ? differenceInCalendarDays(date, addDays(date, -dayOfMonth + 1))
    : differenceInCalendarDays(date, firstDate)

  const isFiveDayInterval = daysFromReference % 5 === 0

  if (isFirstDayOfMonth) {
    // Format the date to show the month name
    return 'month'
  } else if (isFirstDataPoint || isFiveDayInterval) {
    // Return the day number for the first data point and then every five day interval
    return 'day'
  }
  // Return a bullet for all other cases
  return 'bullet'
}
