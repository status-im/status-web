import { AlertIcon, PinIcon, RecentIcon } from '@status-im/icons/20'
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

export const NetworkStateConnecting: Story = {
  args: {
    backgroundColor: '$neutral-80-opa-5',
    icon: <RecentIcon />,
    children: 'Connecting...',
  },
}

export const NetworkStateError: Story = {
  args: {
    backgroundColor: '$danger-50-opa-20',
    icon: <AlertIcon />,
    children: 'Network is down',
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
      <Banner backgroundColor="$neutral-80-opa-5" icon={<RecentIcon />}>
        Connecting...
      </Banner>
      <Banner backgroundColor="$danger-50-opa-20" icon={<AlertIcon />}>
        Network is down
      </Banner>
      <Banner icon={<PinIcon />}>Banner message</Banner>
    </Stack>
  ),
}

export default meta
