import { Skeleton } from './skeleton'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Skeleton> = {
  component: Skeleton,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/1RN1MFwfSqA6jNFJBeNdEu/Posts-%26-Attachments-for-Web?t=1Xf5496ymHeazodw-0',
    },
  },
}

type Story = StoryObj<typeof Skeleton>

export const Avatar: Story = {
  name: 'Avatar',
  args: {},
}

export const Text: Story = {
  name: 'Text',
  args: {
    width: 249,
    br: 6,
    height: 8,
  },
}

export default meta
