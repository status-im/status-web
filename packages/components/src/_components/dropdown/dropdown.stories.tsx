import { DropdownButton } from './dropdown'

import type { Meta, StoryObj } from '@storybook/react'

const sizes = ['40', '32', '24'] as const

// eslint-disable-next-line react/display-name
const renderVariant = (variant: string) => (props: any) =>
  (
    <div className="flex items-center gap-4">
      {sizes.map(size => (
        <DropdownButton key={size} {...props} variant={variant} size={size} />
      ))}
    </div>
  )

const meta = {
  component: DropdownButton,
  title: 'Components/Dropdown Button',
  args: {
    children: 'Dropdown',
    isDisabled: false,
  },

  render: props => (
    <div className="grid gap-4">
      {renderVariant('primary')(props)}
      {renderVariant('grey')(props)}
      {renderVariant('outline')(props)}
      {renderVariant('ghost')(props)}
    </div>
  ),
} satisfies Meta<typeof DropdownButton>

type Story = StoryObj<typeof DropdownButton>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
