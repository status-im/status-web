import { CommandIcon } from '@status-im/icons/20'

import { Shortcut } from './shortcut'

import type { Meta, StoryObj } from '@storybook/react'

const variants = ['primary', 'secondary', 'gray'] as const

// eslint-disable-next-line react/display-name
const renderVariant = (variant: (typeof variants)[number]) => (props: any) => (
  <div className="flex items-center gap-2">
    <Shortcut {...props} variant={variant} icon={CommandIcon} />
    <Shortcut {...props} variant={variant} symbol="K" />
  </div>
)

const meta = {
  component: Shortcut,
  title: 'Components/Shortcut',
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=14367-153939&t=Gfv7STEike06c9nm-11',
    },
  },
  render: props => (
    <div className="grid gap-4">
      {variants.map(variant => renderVariant(variant)(props))}
    </div>
  ),
} satisfies Meta<typeof Shortcut>

type Story = StoryObj<typeof Shortcut>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
