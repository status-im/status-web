import { Stack } from '@tamagui/core'

import { Avatar } from './avatar'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Avatar> = {
  component: Avatar,
  argTypes: {},
}

type Story = StoryObj<typeof Avatar>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space>
        <Avatar {...args} size={80} />
        <Avatar {...args} size={56} />
        <Avatar {...args} size={48} />
        <Avatar {...args} size={32} />
        <Avatar {...args} size={28} />
        <Avatar {...args} size={24} />
        <Avatar {...args} size={20} />
        <Avatar {...args} size={16} />
      </Stack>

      <Stack space>
        <Avatar {...args} size={80} indicator="online" />
        <Avatar {...args} size={56} indicator="online" />
        <Avatar {...args} size={48} indicator="online" />
        <Avatar {...args} size={32} indicator="online" />
        <Avatar {...args} size={28} indicator="online" />
        <Avatar {...args} size={24} indicator="online" />
        <Avatar {...args} size={20} indicator="online" />
        <Avatar {...args} size={16} indicator="online" />
      </Stack>
    </Stack>
  ),
}

export const Rounded: Story = {
  args: {
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
    shape: 'rounded',
  },
  render: args => (
    <Stack space>
      <Avatar {...args} size={80} />
      <Avatar {...args} size={56} />
      <Avatar {...args} size={48} />
      <Avatar {...args} size={32} />
      <Avatar {...args} size={28} />
      <Avatar {...args} size={24} />
      <Avatar {...args} size={20} />
      <Avatar {...args} size={16} />
    </Stack>
  ),
}

export default meta
