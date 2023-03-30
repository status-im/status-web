import { PinIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { Banner } from './banner'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Banner> = {
  component: Banner,
  argTypes: {
    children: {
      control: 'text',
    },
  },
}

type Story = StoryObj<typeof Banner>

export const Full: Story = {
  args: {
    icon: <PinIcon />,
    children: 'Banner message',
    count: 5,
  },
}

export const NoIcon: Story = {
  args: {
    children: 'Banner message',
    count: 5,
  },
}

export const NoCount: Story = {
  args: {
    icon: <PinIcon />,
    children: 'Banner message',
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space>
      <Banner icon={<PinIcon />} count={5}>
        Banner message
      </Banner>
      <Banner count={5}>Banner message</Banner>
      <Banner icon={<PinIcon />}>Banner message</Banner>
    </Stack>
  ),
}

export default meta
