import { useEffect, useState } from 'react'

import defaultTheme from 'tailwindcss/defaultTheme'

// If we had custom breakpoints, we could use this to get the current breakpoint but we will use the default breakpoints for now
// import resolveConfig from 'tailwindcss/resolveConfig'
// import tailwindConfig from '../../tailwind.config'

// const fullConfig = resolveConfig(tailwindConfig)

export function useCurrentBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState('')

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const breakpoints = defaultTheme.screens
        ? Object.entries(defaultTheme.screens)
        : []

      for (let i = breakpoints.length - 1; i >= 0; i--) {
        const [breakpoint, minWidth] = breakpoints[i]

        const convertedMinWidth = parseInt(minWidth, 10)

        if (screenWidth >= convertedMinWidth) {
          setCurrentBreakpoint(breakpoint)
          break
        }
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return currentBreakpoint || 'sm' // Default breakpoint if none matches or during SSR
}
