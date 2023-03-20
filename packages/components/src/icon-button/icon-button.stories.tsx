import { OptionsIcon } from '@status-im/icons/20'
import { Stack } from 'tamagui'

import { IconButton } from './icon-button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof IconButton> = {
  component: IconButton,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=10466-128996&t=GxddSvW99WvZQY0A-11',
    },
  },
}

type Story = StoryObj<typeof IconButton>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    icon: <OptionsIcon />,
  },
  render: args => {
    return (
      <Stack space backgroundColor="" padding={40}>
        <Stack flexDirection="row" gap={8}>
          <IconButton {...args} variant="default" />
          <IconButton {...args} variant="outline" selected />
          <IconButton {...args} variant="ghost" />
          <IconButton {...args} variant="default" aria-selected />
          <IconButton {...args} variant="outline" aria-selected />
          <IconButton {...args} variant="ghost" aria-selected />
        </Stack>

        <Stack flexDirection="row" gap={8}>
          <IconButton {...args} variant="default" blur />
          <IconButton {...args} variant="outline" blur />
          <IconButton {...args} variant="ghost" blur />
          <IconButton {...args} variant="default" blur aria-selected />
          <IconButton {...args} variant="outline" blur aria-selected />
          <IconButton {...args} variant="ghost" blur aria-selected />
        </Stack>
      </Stack>
    )
  },
}

export default meta
