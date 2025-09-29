'use client'

import { useMemo } from 'react'

import { LatestReleaseTagsContext } from './_context/latest-release-tag-context'

import type { GitHubRelease } from '~server/services/github'

type Props = {
  children: React.ReactNode
  mobileRelease: GitHubRelease | null
  desktopRelease: GitHubRelease | null
}

export function WebsiteProvider(props: Props) {
  const { children, mobileRelease, desktopRelease } = props

  return (
    <LatestReleaseTagsContext.Provider
      value={useMemo(
        () => ({
          mobile: mobileRelease?.tag_name ?? null,
          desktop: desktopRelease?.tag_name ?? null,
        }),
        [mobileRelease, desktopRelease]
      )}
    >
      {children}
    </LatestReleaseTagsContext.Provider>
  )
}
