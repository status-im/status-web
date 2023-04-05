import { GapMessages } from './gap-messages'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof GapMessages> = {
  title: 'gap-messages',
  component: GapMessages,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=5187-181408&t=5dgANDld90Qfd00V-0',
    },
  },
}

type Story = StoryObj<typeof GapMessages>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    message: 'This is a simple message.',
    startDate: 'Jan 8 · 09:12',
    endDate: 'Mar 8 · 22:42',
    tooltipMessage: 'This is some tooltip message.',
  },
}

export default meta
