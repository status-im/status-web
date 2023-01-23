/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as icons12 from '@status-im/icons/12'
import * as icons16 from '@status-im/icons/16'
import * as icons20 from '@status-im/icons/20'
import * as reactions from '@status-im/icons/reactions'

import { Paragraph } from '../typography'

import type { IconProps } from '@status-im/icons/types'
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
      <>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.keys(icons12).map(name => {
            // @ts-ignore
            // eslint-disable-next-line import/namespace
            const Icon = icons12[name] as React.FunctionComponent<IconProps>

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
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.keys(icons16).map(name => {
            // @ts-ignore
            // eslint-disable-next-line import/namespace
            const Icon = icons16[name] as React.FunctionComponent<IconProps>

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
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.keys(icons20).map(name => {
            // @ts-ignore
            // eslint-disable-next-line import/namespace
            const Icon = icons20[name] as React.FunctionComponent<IconProps>

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
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.keys(reactions).map(name => {
            // @ts-ignore
            // eslint-disable-next-line import/namespace
            const Icon = reactions[name] as React.FunctionComponent<IconProps>

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
      </>
    )
  },
}

export default meta
