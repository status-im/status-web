import { AudioMessage } from './audio-message'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof AudioMessage> = {
  component: AudioMessage,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Web?node-id=7131%3A360528&t=11hKj5jyWVroXgdu-4',
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
