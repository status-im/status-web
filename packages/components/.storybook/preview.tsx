import React from 'react'
import type { Preview } from '@storybook/react'

import './reset.css'

const preview: Preview = {
  parameters: {
    // layout: 'centered',
    customisation: {
      default: 'blue',
      values: [
        { name: 'blue', value: '#0000ff' },
        { name: 'red', value: '#ff0000' },
      ],
    },
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#fff' },
        { name: 'dark', value: '#0D1625' },
      ],
    },
  },
  decorators: [
    (Story, context) => {
      document.body.classList.toggle(
        'dark',
        context.parameters.backgrounds?.default === 'dark'
      )

      return <Story />
    },
  ],
}

export default preview
