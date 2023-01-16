import { Button } from './button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Button> = {
  component: Button,
  argTypes: {},
}

type Story = StoryObj<typeof Button>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {
    children: 'Click me',
  },
}

export const PrimaryLong: Story = {
  args: {
    children: 'Lorem ipsum dim sum',
  },
}

export const Success: Story = {
  args: {
    type: 'positive',
    children: 'Click me',
  },
}

export default meta
