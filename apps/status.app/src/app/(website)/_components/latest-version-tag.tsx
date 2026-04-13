'use client'

import { Tag } from '@status-im/components'
import { useTranslations } from 'next-intl'

import { useLatestReleaseTags } from '~website/_context/latest-release-tag-context'

type Props = Pick<React.ComponentProps<typeof Tag>, 'label'> & {
  platform: 'mobile' | 'desktop'
}

export function LatestVersionTag(props: Props) {
  const { platform, ...tagProps } = props
  const t = useTranslations('common')

  const latestReleaseTags = useLatestReleaseTags()

  if (!latestReleaseTags[platform]) {
    return <Tag size="32" {...tagProps} label={t('latest')} />
  }

  return (
    <Tag
      size="32"
      {...tagProps}
      label={t('version', { version: latestReleaseTags[platform] })}
    />
  )
}
