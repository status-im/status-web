import { DropdownButton } from './dropdown-button'

import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof DropdownButton>

export default {
  component: DropdownButton,
  title: 'Components/Dropdown Button',
  argTypes: {
    children: {
      control: 'text',
    },
    isDisabled: {
      control: 'boolean',
    },
  },
  args: {
    children: 'Dropdown',
    isDisabled: false,
  },

  render: args => (
    <div className="grid gap-4">
      {(['primary', 'grey', 'outline', 'ghost'] as const).map(variant => (
        <div key={variant} className="flex items-center gap-4">
          {(['40', '32', '24'] as const).map(size => (
            <DropdownButton
              key={size}
              {...args}
              variant={variant}
              size={size}
            />
          ))}
        </div>
      ))}
    </div>
  ),
} satisfies Meta<typeof DropdownButton>

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
