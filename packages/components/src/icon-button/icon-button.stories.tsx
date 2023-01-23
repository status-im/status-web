import { OptionsIcon } from '@status-im/icons/20'

import { IconButton } from './icon-button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof IconButton> = {
  component: IconButton,
  argTypes: {},
}

type Story = StoryObj<typeof IconButton>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    icon: <OptionsIcon />,
  },
}

export default meta
