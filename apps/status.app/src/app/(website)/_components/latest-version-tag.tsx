'use client'

import { Tag } from '@status-im/components'

import { useLatestReleaseTags } from '~website/_context/latest-release-tag-context'

type Props = Pick<React.ComponentProps<typeof Tag>, 'label'> & {
  platform: 'mobile' | 'desktop'
}

export function LatestVersionTag(props: Props) {
  const { platform, ...tagProps } = props

  const latestReleaseTags = useLatestReleaseTags()

  if (!latestReleaseTags[platform]) {
    return <Tag size="32" {...tagProps} label="Latest" />
  }

  return (
    <Tag
      size="32"
      {...tagProps}
      label={`Version ${latestReleaseTags[platform]}`}
    />
  )
}
