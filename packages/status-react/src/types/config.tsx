import type { Theme } from './theme'
import type { BrowserRouter, HashRouter, MemoryRouter } from 'react-router-dom'

export type Environment = 'production' | 'test'

export interface Config {
  publicKey: string
  environment?: Environment
  theme?: Theme
  router?: typeof BrowserRouter | typeof MemoryRouter | typeof HashRouter
}
