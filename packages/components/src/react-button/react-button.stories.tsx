import { XStack } from 'tamagui'

import { ReactButton } from './react-button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof ReactButton> = {
  component: ReactButton,
  args: {},
  argTypes: {},
  render: args => (
    <XStack gap={4}>
      <ReactButton {...args} type="laugh" />
      <ReactButton {...args} type="love" />
      <ReactButton {...args} type="sad" />
      <ReactButton {...args} type="thumbs-up" />
      <ReactButton {...args} type="thumbs-down" />
      <ReactButton {...args} type="angry" />
      <ReactButton {...args} type="add" />
    </XStack>
  ),
}

type Story = StoryObj<typeof ReactButton>

export const Default: Story = {}

export default meta
