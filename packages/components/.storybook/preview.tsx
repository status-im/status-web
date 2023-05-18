import React from 'react'
import type { Preview } from '@storybook/react'

import { Provider, ToastContainer } from '../src'

import './reset.css'

// export const parameters: Parameters = {
//   actions: { argTypesRegex: '^on[A-Z].*' },
//   controls: {
//     matchers: {
//       color: /(background|color)$/i,
//       date: /Date$/,
//     },
//   },
// }

const preview: Preview = {
  parameters: {
    // layout: 'centered',
  },
  decorators: [
    Story => {
      return (
        <Provider>
          <Story />
          <ToastContainer />
        </Provider>
      )
    },
  ],
}

export default preview
