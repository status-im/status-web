import { Message } from './message'

import type { ReactionsType } from './types'
import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Message> = {
  title: 'messages',
  component: Message,
  args: {
    reactions: {},
  },
  argTypes: {
    pinned: {
      type: 'boolean',
      defaultValue: false,
    },
    reply: {
      type: 'boolean',
      defaultValue: false,
    },
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=611%3A36006&t=Gyy71OAckl3b2TWj-4',
    },
  },
}

type Story = StoryObj<typeof Message>

const reactions: ReactionsType = {
  love: new Set(['me', '1', '2', '3']),
  'thumbs-up': new Set(['me', '1', '2', '3']),
  'thumbs-down': new Set(['me', '1', '2', '3']),
}

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Text: Story = {
  args: {
    text: 'This is a simple message.',
  },
}

export const TextWithReactions: Story = {
  name: 'Text + Reactions',
  args: {
    text: 'This is a simple message.',
    reactions,
  },
}

export const TextWithReply: Story = {
  name: 'Text + Reply',
  args: {
    text: 'This is a simple message.',
    reply: true,
  },
}

export const TextPinned: Story = {
  name: 'Text + Pinned',
  args: {
    text: 'This is a simple message.',
    pinned: true,
  },
}

export const LongText: Story = {
  name: 'Long text',
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
}

export const LongTextReactions: Story = {
  name: 'Long text + Reactions',
  args: {
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    reactions,
  },
}

export const OneImage: Story = {
  name: 'One Image',
  args: {
    text: 'There is one image in this post',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export const TwoImages: Story = {
  name: 'Two Images',
  args: {
    text: 'There are two images in this post',
    images: [
      {
        url: 'https://images.pexels.com/photos/16108218/pexels-photo-16108218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export const ThreeImages: Story = {
  name: 'Three Images',
  args: {
    text: 'There are three images in this post',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.pexels.com/photos/16108218/pexels-photo-16108218.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export const FourImages: Story = {
  name: 'Four Images',
  args: {
    text: 'There are four images in this post',
    images: [
      {
        url: 'https://images.pexels.com/photos/8147729/pexels-photo-8147729.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export const FiveImages: Story = {
  name: 'Five Images',
  args: {
    text: 'There are five images in this post',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export const SixImages: Story = {
  name: 'Six Images',
  args: {
    text: 'There are six images in this post',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export const ImageWithReactions: Story = {
  name: 'Image + Reactions',
  args: {
    reactions,

    images: [
      {
        url: 'https://images.unsplash.com/photo-1673831792265-68b44126c999?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=866&q=80',
      },
    ],
  },
}

export default meta
