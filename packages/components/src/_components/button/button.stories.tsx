import { PlaceholderIcon } from '@status-im/icons/20'

import { Button } from './button'

import type { Meta, StoryObj } from '@storybook/react'

const sizes = ['40', '32', '24'] as const

// eslint-disable-next-line react/display-name
const renderVariant = (variant: string) => (props: any) =>
  (
    <div className="flex items-center gap-4">
      {sizes.map(size => (
        <Button key={size} {...props} variant={variant} size={size} />
      ))}
    </div>
  )

const meta = {
  component: Button,
  title: 'Components/Button',
  args: {
    children: 'Button',
    isDisabled: false,
    iconBefore: PlaceholderIcon,
    iconAfter: PlaceholderIcon,
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=4%3A32&mode=dev',
    },
  },

  render: props => (
    <div className="grid gap-4">
      {renderVariant('primary')(props)}
      {renderVariant('positive')(props)}
      {renderVariant('grey')(props)}
      {renderVariant('darkGrey')(props)}
      {renderVariant('outline')(props)}
      {renderVariant('ghost')(props)}
      {renderVariant('danger')(props)}
    </div>
  ),
} satisfies Meta<typeof Button>

type Story = StoryObj<typeof Button>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
