import { useEffect, useState } from 'react'

import defaultTheme from 'tailwindcss/defaultTheme'

// If we had custom breakpoints, we could use this to get the current breakpoint but we will use the default breakpoints for now
// import resolveConfig from 'tailwindcss/resolveConfig'
// import tailwindConfig from '../../tailwind.config'

// const fullConfig = resolveConfig(tailwindConfig)

type Breakpoint = keyof (typeof defaultTheme)['screens']

export function useCurrentBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm')

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth
      const breakpoints = Object.entries(defaultTheme.screens) as [
        Breakpoint,
        string
      ][]

      for (let i = breakpoints.length - 1; i >= 0; i--) {
        const [breakpoint, minWidth] = breakpoints[i]

        const convertedMinWidth = parseInt(minWidth, 10)

        if (screenWidth >= convertedMinWidth) {
          setBreakpoint(breakpoint)
          return
        }
      }
    }

    handleResize()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return breakpoint
}
