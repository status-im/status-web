import { useState } from 'react'

import { Checkbox } from './checkbox'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=180-9685&t=tDEqIV09qddTZgXF-4',
    },
  },
}

type Story = StoryObj<typeof Checkbox>

const CheckBoxWithHookFilled = () => {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      id="checkbox"
      selected={checked}
      onCheckedChange={() => setChecked(!checked)}
      variant="filled"
    />
  )
}

const CheckBoxWithHookOutlined = () => {
  const [checked, setChecked] = useState(false)

  return (
    <Checkbox
      id="checkbox"
      selected={checked}
      onCheckedChange={() => setChecked(!checked)}
      variant="outline"
    />
  )
}

export const Filled: Story = {
  render: () => {
    return <CheckBoxWithHookFilled />
  },
}

export const Outlined: Story = {
  render: () => {
    return <CheckBoxWithHookOutlined />
  },
}

export default meta
