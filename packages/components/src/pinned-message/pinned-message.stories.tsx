import { PinnedMessage } from './pinned-message'

import type { Meta, StoryObj } from '@storybook/react'

const mockMessages = [
  {
    text: 'First message',
  },
  {
    text: 'Second message',
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
