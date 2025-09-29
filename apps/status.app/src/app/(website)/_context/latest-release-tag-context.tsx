'use client'

import { createContext, useContext } from 'react'

export type LatestReleaseTagsContextValue = {
  mobile: string | null
  desktop: string | null
}

export const LatestReleaseTagsContext =
  createContext<LatestReleaseTagsContextValue | null>({
    mobile: null,
    desktop: null,
  })

export const useLatestReleaseTags = () => {
  const latestRelease = useContext(LatestReleaseTagsContext)

  if (!latestRelease) {
    console.warn(
      'useLatestRelease must be used within a LatestReleaseTagsContext.Provider'
    )
    return {
      mobile: null,
      desktop: null,
    }
  }

  return latestRelease
}
