import { TamaguiProvider } from '@tamagui/core'

import { config } from '../tamagui.config'

type Theme = 'light' | 'dark'

type Props = {
  children: React.ReactNode
  defaultTheme?: Theme
}

const ThemeProvider = (props: Props) => {
  const { children, defaultTheme = 'light' } = props
  return (
    // TODO: store theme in localStorage
    <TamaguiProvider config={config} defaultTheme={defaultTheme}>
      {children}
    </TamaguiProvider>
  )
}

export { ThemeProvider }
export type ThemeProviderProps = Omit<Props, 'children'>
export type { Theme }
