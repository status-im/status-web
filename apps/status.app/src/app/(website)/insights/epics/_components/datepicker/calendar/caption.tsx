'use client'

import { Button } from '@status-im/components'
import { ChevronLeftIcon, ChevronRightIcon } from '@status-im/icons/20'
import { format } from 'date-fns'
import { useTranslations } from 'next-intl'
import { useNavigation } from 'react-day-picker'

import type { CaptionProps } from 'react-day-picker'

const CustomCaption = (props: CaptionProps) => {
  const { goToMonth, nextMonth, previousMonth } = useNavigation()
  const t = useTranslations('insights')
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
            aria-label={t('goToPreviousMonth')}
            icon={<ChevronLeftIcon />}
            disabled={!previousMonth}
            onPress={() => previousMonth && goToMonth(previousMonth)}
          />
          <Button
            variant="ghost"
            aria-label={t('goToNextMonth')}
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
