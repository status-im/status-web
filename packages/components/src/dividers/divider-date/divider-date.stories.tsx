import { DividerDate } from './divider-date'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof DividerDate> = {
  component: DividerDate,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=5626-159384&t=OkwNsSt1XE3TE2SS-11',
    },
  },
}

type Story = StoryObj<typeof DividerDate>

export const Default: Story = {
  args: {
    label: 'Today',
  },
}

export default meta
