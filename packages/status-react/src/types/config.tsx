import type { Theme } from '../styles/config'
import type { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom'

export type Environment = 'production' | 'test'

export interface Config {
  publicKey: string
  environment?: Environment
  theme?: Theme
  router?: typeof BrowserRouter | typeof MemoryRouter | typeof HashRouter
  options?: {
    enableSidebar: boolean
    enableMembers: boolean
  }
}
