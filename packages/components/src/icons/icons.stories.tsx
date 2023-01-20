/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as icons from '@status-im/icons'

import { Paragraph } from '../typography'

import type { IconProps } from '@status-im/icons'
import type { Meta, StoryObj } from '@storybook/react'
import type React from 'react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta = {
  title: 'icons',
  // component: Button,
  argTypes: {},
}

type Story = StoryObj

function unpascal(str: string) {
  return str.replace(/([A-Z])/g, ' $1').trim()
}

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const All: Story = {
  args: {},
  render: () => {
    return (
      <div style={{ display: 'grid', gap: 12 }}>
        {Object.keys(icons).map(name => {
          // @ts-ignore
          // eslint-disable-next-line import/namespace
          const Icon = icons[name] as React.FunctionComponent<IconProps>

          return (
            <div
              key={name}
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <Icon color="$background" />
              <Paragraph>{unpascal(name)}</Paragraph>
            </div>
          )
        })}
      </div>
    )
  },
}

export default meta
