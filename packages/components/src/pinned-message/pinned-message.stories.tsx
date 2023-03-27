import { PinnedMessage } from './pinned-message'

import type { Meta, StoryObj } from '@storybook/react'

const mockMessages = [
  {
    text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam a, posuere eu, velit.',
    reactions: {},
    pinned: true,
    id: '1234-1234',
  },
  {
    text: 'Morbi a metus. Phasellus enim erat, vestibulum vel, aliquam. message',
    reactions: {},
    pinned: true,
    id: '4321-4321',
  },
]

const meta: Meta<typeof PinnedMessage> = {
  component: PinnedMessage,
  argTypes: {
    messages: mockMessages,
  },
}

type Story = StoryObj<typeof PinnedMessage>

export const Primary: Story = {
  args: {
    messages: mockMessages,
    // children: 'Click me',
  },
}

export default meta
