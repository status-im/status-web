import { XStack } from 'tamagui'

import { DynamicButton } from './dynamic-button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof DynamicButton> = {
  component: DynamicButton,
  args: {},
  argTypes: {},
}

type Story = StoryObj<typeof DynamicButton>

export const Default: Story = {
  render: () => (
    <XStack gap={4}>
      <DynamicButton type="mention" count={7} />
      <DynamicButton type="notification" count={8} />
      <DynamicButton type="notification" count={0} />
    </XStack>
  ),
}

export default meta
