import { Tooltip } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/16'
// Use 20px InfoIcon to match existing usage patterns
import { InfoIcon } from '@status-im/icons/20'
import { ButtonLink } from '@status-im/status-network/components'

import { TOOLTIP_CONFIG } from '~constants/staking'

import type { ReactNode } from 'react'

type Props = {
  content: ReactNode
  link?: string
}

export const InfoTooltip = ({ content, link }: Props) => (
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
            Learn more
          </ButtonLink>
        )}
      </div>
    }
  >
    <InfoIcon
      className={`hidden size-4 text-neutral-40 hover:text-neutral-100 md:block`}
    />
  </Tooltip>
)
