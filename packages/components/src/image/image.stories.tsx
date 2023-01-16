import React from 'react'

import { Stack } from '@tamagui/core'

import { Image } from './image'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Image> = {
  component: Image,
  argTypes: {},
}

type Story = StoryObj<typeof Image>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1673253082952-4ba1b404e5ee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1160&q=80',
    width: 500,
    height: 500,
  },
  render: args => (
    <Stack space spaceDirection="vertical">
      <Image {...args} width={500} height={500} />
      <Image {...args} width={500} height={350} />
      <Image {...args} width={500} height={200} />
    </Stack>
  ),
}

export default meta
