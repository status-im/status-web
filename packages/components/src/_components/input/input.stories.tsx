import { EmailIcon } from '@status-im/icons'

import { Input } from './input'

import type { Meta, StoryObj } from '@storybook/react'

type Component = typeof Input

const meta: Meta<Component> = {
  title: 'Components/Input',
  component: Input,
  args: {
    placeholder: 'Type something...',
    label: 'Label',
    meta: '0/280',
    isInvalid: false,
    isDisabled: false,
    clearable: false,
  },

  render: props => (
    <div className="flex w-[300px] flex-col gap-3">
      <Input {...props} />
      <Input {...props} size="32" />
      <Input {...props} icon={EmailIcon} />
      <Input {...props} icon={EmailIcon} size="32" />
    </div>
  ),
}

type Story = StoryObj<Component>

export const Light: Story = {
  args: {},
}

export const Dark: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
}

export default meta
