import { Tooltip } from '@status-im/components'
import { ExternalIcon, InfoIcon } from '@status-im/icons/16'
import { ButtonLink } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'

import { TOOLTIP_CONFIG } from '~constants/staking'

import type { ReactNode } from 'react'

type Props = {
  content: ReactNode
  link?: string
}

export function InfoTooltip({ content, link }: Props) {
  const t = useTranslations()

  return (
    <Tooltip
      delayDuration={TOOLTIP_CONFIG.DELAY_DURATION}
      side="top"
      className="border-0"
      content={
        <div className="flex w-[286px] flex-col gap-4 rounded-8 bg-white-100 p-4">
          <span className="text-13 text-neutral-100">{content}</span>
          {link && (
            <ButtonLink
              href={link}
              variant="outline"
              className="rounded-8 px-2 py-1"
              size="32"
              icon={<ExternalIcon className="size-3 text-neutral-50" />}
            >
              {t('common.learn_more')}
            </ButtonLink>
          )}
        </div>
      }
    >
      <InfoIcon className={`size-4 text-neutral-40 hover:text-neutral-100`} />
    </Tooltip>
  )
}
