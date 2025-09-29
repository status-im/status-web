import { Button } from '@status-im/components'
import { ChevronLeftIcon, ChevronRightIcon } from '@status-im/icons/20'
import { format } from 'date-fns'
import { useNavigation } from 'react-day-picker'

import type { CaptionProps } from 'react-day-picker'

const CustomCaption = (props: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  return (
    <div className="rdp-nav">
      <div className="rdp-caption">
        <div
          className="rdp-caption_label"
          aria-live="polite"
          role="presentation"
        >
          {format(props.displayMonth, 'MMM yyy')}
        </div>

        <div className="flex">
          <Button
            variant="ghost"
            aria-label="Go to previous month"
            icon={<ChevronLeftIcon />}
            disabled={!previousMonth}
            onPress={() => previousMonth && goToMonth(previousMonth)}
          />
          <Button
            variant="ghost"
            aria-label="Go to next month"
            icon={<ChevronRightIcon />}
            disabled={!nextMonth}
            onPress={() => nextMonth && goToMonth(nextMonth)}
          />
        </div>
      </div>
    </div>
  )
}

export { CustomCaption }
