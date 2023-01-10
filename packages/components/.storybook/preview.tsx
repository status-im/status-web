import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { config } from '../src'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
}

const withThemeProvider = (Story, context) => {
  return (
    <TamaguiProvider config={config}>
      <Story />
    </TamaguiProvider>
  )
}
export const decorators = [withThemeProvider]
