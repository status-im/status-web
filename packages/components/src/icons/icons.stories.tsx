import { createElement } from 'react'

import * as Icon from '@felicio/icons'

import { Text } from '../text'

import type { IconProps } from '@felicio/icons'
import type { Meta, StoryObj } from '@storybook/react'
import type { ColorTokens } from 'tamagui'

const meta: Meta = {
  title: 'Iconography/Overview',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qLLuMLfpGxK9OfpIavwsmK/Iconset?node-id=3239-987&t=ZG8wYDswtYEV1Per-11',
    },
  },
}

type Story = StoryObj<{
  search: string
  size: IconProps['size']
  color: ColorTokens
}>

function unpascal(str: string) {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

export const Overview: Story = {
  args: {
    search: '',
    size: 20,
    // color: '$primary-50',
  },

  argTypes: {
    search: {
      control: 'text',
    },
    size: {
      control: 'select',
      options: [16, 20, 12],
    },
    color: {
      control: 'select',
      options: [],
    },
  },

  render: args => {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 20,
        }}
      >
        {Object.entries(Icon)
          .filter(icon => {
            if (!args.search) return true
            return icon[0].toLowerCase().includes(args.search.toLowerCase())
          })
          .map(([name, component]) => {
            return (
              <div
                key={name}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <div
                  style={{
                    padding: 8,
                    border: '1px solid #eee',
                    borderRadius: 6,
                  }}
                >
                  {createElement(component, {
                    size: args.size,
                    color: args.color,
                  })}
                </div>
                <Text size={11} wrap={false}>
                  {unpascal(name).replace(' Icon', '')}
                </Text>
              </div>
            )
          })}
      </div>
    )
  },
}

export default meta
