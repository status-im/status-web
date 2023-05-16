import { Recorder } from './recorder'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Recorder> = {
  component: Recorder,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=5626-158332&t=9spXA4EwpDCL6d4f-0',
    },
  },
}

type Story = StoryObj<typeof Recorder>

export const Default: Story = {
  name: 'Recorder',
  args: {},
}

export default meta
