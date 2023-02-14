import { Reactions } from './reactions'

import type { ReactionsType } from '../types'
import type { Meta, StoryObj } from '@storybook/react'

const reactions: ReactionsType = {
  love: new Set(['me', '1', '2', '3']),
  'thumbs-up': new Set(['me', '1', '2', '3']),
  'thumbs-down': new Set(['me', '1', '2', '3']),
}

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Reactions> = {
  title: 'messages/reactions',
  component: Reactions,
  args: {
    reactions,
  },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=12375%3A140482&t=87Ziud3PyYYSvsRg-4',
    },
  },
}

type Story = StoryObj<typeof Reactions>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
}

export default meta
