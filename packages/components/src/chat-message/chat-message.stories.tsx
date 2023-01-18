import { ChatMessage } from './chat-message'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof ChatMessage> = {
  component: ChatMessage,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=611%3A36006&t=Gyy71OAckl3b2TWj-4',
    },
  },
}

type Story = StoryObj<typeof ChatMessage>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Simple: Story = {
  args: {
    text: 'This is a simple message.',
  },
}

export const SimpleLongText: Story = {
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
}

export const SimpleWithReactions: Story = {
  name: 'Simple with reactions',
  args: {
    text: 'This is a simple message.',
    reactions: ['thumb'],
  },
}

export const Image: Story = {
  args: {
    images: [
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export default meta
