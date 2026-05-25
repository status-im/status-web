'use client'

import { Tag } from '@status-im/components'
import { useTranslations } from 'next-intl'

type Props = Pick<React.ComponentProps<typeof Tag>, 'label'> & {
  platform: 'mobile' | 'desktop'
}

export function LatestVersionTag(props: Props) {
  const { platform: _platform, ...tagProps } = props
  const t = useTranslations('common')

  return <Tag size="32" {...tagProps} label={t('latest')} />
}
