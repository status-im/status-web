import { AlertIcon, PinIcon, RecentIcon } from '@status-im/icons'
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
    icon: <PinIcon size={20} />,
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
    icon: <PinIcon size={20} />,
    children: 'Banner message',
  },
}

export const NetworkStateConnecting: Story = {
  args: {
    backgroundColor: '$neutral-80/5',
    icon: <RecentIcon size={20} />,
    children: 'Connecting...',
  },
}

export const NetworkStateError: Story = {
  args: {
    backgroundColor: '$danger-/20',
    icon: <AlertIcon size={20} />,
    children: 'Network is down',
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space>
      <Banner icon={<PinIcon size={20} />} count={5}>
        Banner message
      </Banner>
      <Banner count={5}>Banner message</Banner>
      <Banner backgroundColor="$neutral-80/20" icon={<RecentIcon size={20} />}>
        Connecting...
      </Banner>
      <Banner backgroundColor="$danger-/20" icon={<AlertIcon size={20} />}>
        Network is down
      </Banner>
      <Banner icon={<PinIcon size={20} />}>Banner message</Banner>
    </Stack>
  ),
}

export default meta
