import type { Theme } from '../styles/config'
import type { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom'

export type Environment = 'production' | 'test'

type CustomTheme = {
  colors: {
    [key in keyof Theme['colors']]: string
  }
  fonts: {
    [key in keyof Theme['colors']]: string
  }
}

export interface Config {
  publicKey: string
  environment?: Environment
  theme?: 'light' | 'dark' | CustomTheme
  router?: typeof BrowserRouter | typeof MemoryRouter | typeof HashRouter
  options?: {
    enableSidebar?: boolean
    enableMembers?: boolean
  }
}
