import { Player } from './player'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Player> = {
  component: Player,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=5626-158332&t=9spXA4EwpDCL6d4f-0',
    },
  },
}

type Story = StoryObj<typeof Player>

export const Default: Story = {
  name: 'Player',
  args: {
    audio: 'https://wavesurfer-js.org/example/media/demo.wav',
  },
}

export default meta
