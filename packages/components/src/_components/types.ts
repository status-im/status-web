import {} from '@storybook/react'

declare module '@storybook/react' {
  export interface Parameters {
    backgrounds?: {
      default: 'light' | 'dark'
    }
  }
}

export type * as Aria from 'react-aria-components'
