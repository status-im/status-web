import React from 'react'
import { Provider, ToastContainer } from '../src'
import { Parameters, Decorator } from '@storybook/react'

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
      <ToastContainer />
    </Provider>
  )
}
export const decorators = [withThemeProvider]
