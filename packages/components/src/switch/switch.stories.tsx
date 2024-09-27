import { Switch } from './switch'

import type { Meta, StoryObj } from '@storybook/react'

const Variant = (props: React.ComponentProps<typeof Switch>) => {
  return (
    <div className="flex gap-3">
      <Switch {...props} />
      <Switch {...props} defaultChecked />
      <Switch {...props} disabled />
    </div>
  )
}

const meta: Meta<typeof Switch> = {
  title: 'Components/Switch',
  component: Switch,
  args: {
    // size: 'md',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=370-18368&node-type=frame&m=dev',
    },
  },

  render: props => {
    return (
      <div className="grid gap-3">
        <Variant {...props} />
        <Variant {...props} />
      </div>
    )
  },
}

type Story = StoryObj<typeof Switch>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
