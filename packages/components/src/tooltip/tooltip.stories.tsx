import { Button } from '../button'
import { Tooltip } from './tooltip'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=15032%3A174184&t=PHVNitU0s0KwOi8L-0',
    },
  },
}

type Story = StoryObj<typeof Tooltip>

export const Default: Story = {
  args: {
    content: 'Sebastian Vettel reacted with a heart',
  },
  render: args => (
    <Tooltip {...args}>
      <Button type="outline">Trigger</Button>
    </Tooltip>
  ),
}

export default meta
