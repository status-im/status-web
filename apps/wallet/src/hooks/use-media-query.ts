'use client'

import { useEffect, useState } from 'react'

// @see https://tailwindcss.com/docs/screens
const screens = {
  // We simulate the desktop first approach by using min-width 1px above the max-width of the previous breakpoint to match the design breakpoints
  // Otherwise, we would have to use max-width approach and change the entire codebase styles
  sm: '431px',
  md: '641px',
  '2md': '768px',
  lg: '869px',
  xl: '1024px',
  '2xl': '1281px',
  '3xl': '1441px',
  // TODO to be defined by design for pro-users
  '4xl': '1601px',
} as const

type Screen = keyof typeof screens

export function useMediaQuery(screen: Screen): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null)

  useEffect(() => {
    const matchMedia = window.matchMedia(
      `screen and (min-width: ${screens[screen]})`,
    )

    function handleChange() {
      setMatches(matchMedia.matches)
    }

    handleChange()

    matchMedia.addEventListener('change', handleChange)

    return () => {
      matchMedia.removeEventListener('change', handleChange)
    }
  }, [screen])

  return matches
}
