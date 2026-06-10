'use client'

import { useMemo } from 'react'

import { LatestReleaseTagsContext } from './_context/latest-release-tag-context'

/** Subset of GitHub release data used by the website shell (nav version tags). */
type ReleaseTagSource = {
  tag_name: string
}

type Props = {
  children: React.ReactNode
  mobileRelease: ReleaseTagSource | null
  desktopRelease: ReleaseTagSource | null
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
