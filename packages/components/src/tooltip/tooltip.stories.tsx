import { Button } from '../button'
import { Tooltip } from './tooltip'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Tooltip> = {
  component: Tooltip,
  title: 'Components/Tooltip',
  argTypes: {},
  parameters: {
    layout: 'centered',
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=14370-152271&node-type=frame&m=dev',
    },
  },
  args: {
    content: 'Sebastian Vettel reacted with a heart',
  },
  render: args => (
    <div className="flex flex-wrap gap-4">
      {(['left', 'top', 'bottom', 'right'] as const).map(side => (
        <Tooltip key={side} {...args} side={side}>
          <Button variant="primary">{side}</Button>
        </Tooltip>
      ))}
    </div>
  ),
}

type Story = StoryObj<typeof Tooltip>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
