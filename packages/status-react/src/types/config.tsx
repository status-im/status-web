import type { Theme } from './theme'

export type Environment = 'production' | 'test'

export interface Config {
  publicKey: string
  environment?: Environment
  theme?: Theme
}
