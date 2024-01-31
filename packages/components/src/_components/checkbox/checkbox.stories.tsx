import { Checkbox } from './checkbox'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Checkbox> = {
  title: 'Components/Checkbox',
  component: Checkbox,
  args: {
    isSelected: true,
    children: 'I agree with the community rules',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=180-9685&t=tDEqIV09qddTZgXF-4',
    },
  },

  render: props => {
    return (
      <div className="grid gap-3">
        <Checkbox {...props} variant="outline" />
        <Checkbox {...props} variant="filled"></Checkbox>
      </div>
    )
  },
}

type Story = StoryObj<typeof Checkbox>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
