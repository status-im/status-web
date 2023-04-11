import { AppProvider } from './app-context'
import { ChatProvider } from './chat-context'
import { ThemeProvider } from './theme-context'

import type { ThemeProviderProps } from './theme-context'

type Props = ThemeProviderProps & {
  children: React.ReactNode
}

const Provider = (props: Props) => {
  const { children } = props

  return (
    <ThemeProvider defaultTheme={props.defaultTheme}>
      <AppProvider>
        {/* <ChatProvider>{children}</ChatProvider> */}
        {children}
      </AppProvider>
    </ThemeProvider>
  )
}

export { Provider }
