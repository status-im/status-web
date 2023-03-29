import { MessageSkeleton } from './message-skeleton'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof MessageSkeleton> = {
  component: MessageSkeleton,

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/1RN1MFwfSqA6jNFJBeNdEu/Posts-%26-Attachments-for-Web?t=1Xf5496ymHeazodw-0',
    },
  },
}

type Story = StoryObj<typeof MessageSkeleton>

export const MessageSkeletonSmallest: Story = {
  name: 'Smallest',
  args: {
    size: 'smallest',
  },
}
export const MessageSkeletonSmall: Story = {
  name: 'Small',
  args: {
    size: 'small',
  },
}
export const MessageSkeletonMedium: Story = {
  name: 'Medium',
  args: {
    size: 'medium',
  },
}
export const MessageSkeletonLarge: Story = {
  name: 'Large',
  args: {
    size: 'large',
  },
}

export default meta
