import React, {
  createContext,
  useContext,
  useLayoutEffect,
  useMemo,
} from 'react'

import { createTheme, darkTheme, theme as defaultTheme } from '../styles/config'

import type { Theme } from '../styles/config'
import type { Config } from '../types/config'

const ThemeContext = createContext<Theme | undefined>(undefined)

interface Props {
  theme: Config['theme']
  children: React.ReactNode
}

export const ThemeProvider = (props: Props) => {
  const { children, theme = 'light' } = props

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

  return (
    <ThemeContext.Provider value={appTheme}>{children}</ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}
