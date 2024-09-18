import { Button } from './button'

import type { Meta, StoryObj } from '@storybook/react'

type Story = StoryObj<typeof Button>

const meta: Meta<
  typeof Button & { showIconBefore: boolean; showIconAfter: boolean }
> = {
  component: Button,
  title: 'Components/Button',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=4%3A32&mode=dev',
    },
  },
  argTypes: {
    children: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
    iconBefore: {
      control: 'boolean',
    },
    iconAfter: {
      control: 'boolean',
    },
  },

  args: {
    children: 'Button',
    disabled: false,
    // variant: 'primary',
    // size: '40',
  },
  render: args => (
    <div className="grid gap-4">
      {(
        [
          'primary',
          'positive',
          'grey',
          'darkGrey',
          'outline',
          'ghost',
          'danger',
        ] as const
      ).map(variant => (
        <div key={variant} className="flex items-center gap-4">
          {(['40', '32', '24'] as const).map(size => (
            <Button key={size} {...args} variant={variant} size={size} />
          ))}
        </div>
      ))}
    </div>
  ),
}

export default meta

export const Light: Story = {}

export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}
