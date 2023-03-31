import { PinAnnouncement } from './pin-announcement'

import type { Meta, StoryObj } from '@storybook/react'

const mockMessage = {
  text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.',
  reactions: {},
  pinned: true,
  id: '1234-1234',
}

const meta: Meta<typeof PinAnnouncement> = {
  component: PinAnnouncement,
}

type Story = StoryObj<typeof PinAnnouncement>

export const Primary: Story = {
  args: {
    name: 'Pavel',
    message: mockMessage,
  },
}

export default meta
