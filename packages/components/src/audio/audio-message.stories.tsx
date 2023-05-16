import { AudioMessage } from './audio-message'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof AudioMessage> = {
  component: AudioMessage,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=5626-159377&t=9spXA4EwpDCL6d4f-0',
    },
  },
}

type Story = StoryObj<typeof AudioMessage>

export const Default: Story = {
  args: {
    url: 'https://wavesurfer-js.org/example/media/demo.wav',
  },
}

export default meta
