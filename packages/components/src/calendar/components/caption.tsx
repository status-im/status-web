import { ChevronLeftIcon, ChevronRightIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import { format } from 'date-fns'
import { useNavigation } from 'react-day-picker'

import { IconButton } from '../../icon-button'

import type { CaptionProps } from 'react-day-picker'

const CustomCaption = (props: CaptionProps): JSX.Element => {
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

export { CustomCaption }
