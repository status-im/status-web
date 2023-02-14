import React from 'react'
import { TamaguiProvider } from '@tamagui/core'
import { config } from '../src'
import { Parameters, Decorator } from '@storybook/react'

import './reset.css'

export const parameters: Parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

const withThemeProvider: Decorator = (Story, _context) => {
  return (
    <TamaguiProvider config={config}>
      <Story />
    </TamaguiProvider>
  )
}
export const decorators = [withThemeProvider]
