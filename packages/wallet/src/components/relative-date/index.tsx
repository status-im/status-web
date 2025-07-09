import { format, isToday, isYesterday } from 'date-fns'

type Props = {
  timestamp: Date | string | number
  className?: string
}

export const RelativeDate = (props: Props) => {
  const { timestamp, className } = props
  const date = new Date(timestamp)

  const formatDate = () => {
    if (isToday(date)) {
      return `Today ${format(date, 'HH:mm')}`
    }
    if (isYesterday(date)) {
      return `Yesterday ${format(date, 'HH:mm')}`
    }
    return format(date, 'dd MMMM HH:mm')
  }

  return <span className={className}>{formatDate()}</span>
}
