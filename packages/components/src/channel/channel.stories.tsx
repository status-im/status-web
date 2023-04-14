import { Stack } from '@tamagui/core'

import { Channel } from './channel'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Channel> = {
  component: Channel,
  args: {
    emoji: '🍑',
    children: 'channel',
  },

  argTypes: {},

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=411-18564&t=kX5LC5OYFnSF8BiZ-11',
    },
  },

  render: args => (
    <Stack space flexDirection="row">
      <Stack space width={336}>
        <Channel {...args} type="default" />
        <Channel {...args} type="default" selected />

        <Channel {...args} type="notification" />
        <Channel {...args} type="notification" selected />

        <Channel {...args} type="mention" mentionCount={10} />
        <Channel {...args} type="mention" mentionCount={10} selected />

        <Channel {...args} type="muted" />
        <Channel {...args} type="muted" selected />
      </Stack>
    </Stack>
  ),
}

type Story = StoryObj<typeof Channel>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
}

export const Locked: Story = {
  args: {
    lock: 'locked',
  },
}

export const Unlocked: Story = {
  args: {
    lock: 'unlocked',
  },
}

export default meta
