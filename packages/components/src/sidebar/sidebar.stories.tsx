import { CHANNEL_GROUPS } from './mock-data'
import { Sidebar } from './sidebar'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Sidebar> = {
  title: 'Sidebar/Community',
  component: Sidebar,
  args: {
    channels: CHANNEL_GROUPS,
  },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=14692%3A148489&t=NfQkS7CPSrZknAGF-4',
    },
  },
}

type Story = StoryObj<typeof Sidebar>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
}

export default meta
