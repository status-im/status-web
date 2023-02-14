import { XStack } from 'tamagui'

import { ReactButton } from './react-button'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof ReactButton> = {
  title: 'ReactButton',
  component: ReactButton,
  args: {},
  argTypes: {},
  render: args => (
    <XStack space={4}>
      <ReactButton {...args} icon="laugh" />
      <ReactButton {...args} icon="love" />
      <ReactButton {...args} icon="sad" />
      <ReactButton {...args} icon="thumbs-up" />
      <ReactButton {...args} icon="thumbs-down" />
      <ReactButton {...args} icon="angry" />
    </XStack>
  ),
}

type Story = StoryObj<typeof ReactButton>

export const Outline: Story = {
  name: 'Outline / 40px',
  args: { variant: 'outline' },
}

export const OutlineSelected: Story = {
  name: 'Outline / 40px / selected',
  args: { variant: 'outline', selected: true },
}

export const Outline32: Story = {
  name: 'Outline / 32px',
  args: { variant: 'outline', size: 32 },
}

export const Outline32Selected: Story = {
  name: 'Outline / 32px',
  args: { variant: 'outline', size: 32, selected: true },
}

export const Ghost: Story = {
  name: 'Ghost / 40px',
  args: { variant: 'ghost' },
}

export const GhostSelected: Story = {
  name: 'Ghost / 40px / selected',
  args: { variant: 'ghost', selected: true },
}

export const Ghost32: Story = {
  name: 'Ghost / 32px',
  args: { variant: 'ghost', size: 32 },
}

export const Ghost32Selected: Story = {
  name: 'Ghost / 32px',
  args: { variant: 'ghost', size: 32, selected: true },
}

export default meta
