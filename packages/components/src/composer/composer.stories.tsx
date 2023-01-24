import { Composer } from './composer'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Composer> = {
  component: Composer,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=3155%3A49848&t=87Ziud3PyYYSvsRg-4',
    },
  },
}

type Story = StoryObj<typeof Composer>

export const Default: Story = {
  args: {},
}

export default meta
