import { useLayoutEffect, useMemo } from 'react'

import { createTheme, darkTheme, theme as defaultTheme } from '../styles/config'

import type { Config } from '../types/config'

export const useTheme = (theme?: Config['theme']) => {
  const appTheme = useMemo(() => {
    if (!theme || theme === 'light') {
      return defaultTheme
    }

    if (theme === 'dark') {
      return darkTheme
    }

    return createTheme({
      colors: theme.colors,
      fonts: theme.fonts,
    })
  }, [theme])

  useLayoutEffect(() => {
    document.body.classList.add(appTheme)

    return () => {
      document.body.classList.remove(appTheme)
    }
  }, [appTheme])
}
