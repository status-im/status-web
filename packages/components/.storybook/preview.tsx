import React from 'react'
import type { Preview } from '@storybook/react'
import { customisation } from '@status-im/colors'
import './reset.css'

const preview: Preview = {
  globalTypes: {
    customisation: {
      toolbar: {
        title: 'Customisation',
        // icon: 'paintbrush',
        defaultValue: 'blue',
        items: Object.keys(customisation),
        dynamicTitle: true,
        defaultItem: 'army',
      },
    },
  },

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
      document.body.setAttribute(
        'data-theme',
        context.parameters.backgrounds?.default === 'dark' ? 'dark' : 'light',
      )

      document.body.setAttribute(
        'data-customisation',
        context.globals.customisation,
      )

      return <Story />
    },
  ],
}

export default preview
