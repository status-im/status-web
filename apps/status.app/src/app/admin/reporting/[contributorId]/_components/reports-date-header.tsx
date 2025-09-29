'use client'

import { ArrowRightIcon } from '@status-im/icons/16'
import { cva } from 'class-variance-authority'
import { endOfWeek, format, getWeek, getYear } from 'date-fns'

type Props = {
  size: 13 | 15
  startOfWeek: Date
}

const styles = cva('flex gap-1 font-medium text-neutral-100', {
  variants: {
    size: {
      13: 'text-13',
      15: 'text-15',
    },
  },
})

const ReportsDateHeader = (props: Props) => {
  const { size, startOfWeek } = props

  return (
    <span className={styles({ size })}>
      <span>
        Week {getWeek(startOfWeek, { weekStartsOn: 1 })},{' '}
        {getYear(new Date(startOfWeek))}
      </span>
      <span className="flex items-center gap-1 font-medium text-neutral-50">
        ({format(startOfWeek, 'MMM dd')}
        <ArrowRightIcon className="text-neutral-40" />{' '}
        {format(endOfWeek(startOfWeek, { weekStartsOn: 1 }), 'MMM dd')})
      </span>
    </span>
  )
}

export { ReportsDateHeader }
