import '@storybook/react'

declare module '@storybook/react' {
  export interface Parameters {
    backgrounds?: {
      default: 'light' | 'dark'
      // values?: Array<{ name: string; value: string }>
    }
  }
}
