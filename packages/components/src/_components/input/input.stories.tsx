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
    isInvalid: true,
    isDisabled: false,
  },
  argTypes: {
    isInvalid: {
      type: 'boolean',
    },
  },
}

type Story = StoryObj<Component>

export const Light: Story = {
  args: {},

  render: props => (
    <div className="flex w-[300px] flex-col gap-3">
      <Input {...props} />
      <Input {...props} size="32" />
      <Input {...props} icon={EmailIcon} />
      <Input {...props} icon={EmailIcon} size="32" />
    </div>
  ),
}

export const Dark: Story = {
  args: {},

  render: props => (
    <div className="flex w-[300px] flex-col gap-3">
      <Input {...props} />
      <Input {...props} size="32" />
      <Input {...props} icon={EmailIcon} />
      <Input {...props} icon={EmailIcon} size="32" />
    </div>
  ),
}

export default meta
