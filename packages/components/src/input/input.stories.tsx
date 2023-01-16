import { Input } from './input'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Input> = {
  component: Input,
  argTypes: {},
}

type Story = StoryObj<typeof Input>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    placeholder: 'Type something...',
    // children: 'Click me',
  },
}

export default meta
