import React from 'react'
import { Parameters, Decorator } from '@storybook/react'

import { Provider } from '../src'

import './reset.css'
import './components.css'

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
    <Provider>
      <Story />
    </Provider>
  )
}
export const decorators = [withThemeProvider]
