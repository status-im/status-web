import React from 'react'

import ContentLoader from 'react-content-loader'

export const MessageLoader = () => {
  return (
    <ContentLoader
      speed={2}
      width={880}
      height={64}
      viewBox="0 0 880 64"
      backgroundColor="var(--colors-accent-8)"
      foregroundColor="var(--colors-accent-5)"
    >
      <circle cx="36" cy="30" r="20" />
      <rect x="64" y="8" rx="8" ry="8" width="132" height="20" />
      <rect x="200" y="11" rx="4" ry="4" width="50" height="14" />
      <rect x="64" y="35" rx="8" ry="8" width="574" height="20" />
    </ContentLoader>
  )
}
