import { Textarea } from './textarea'

import type { Meta, StoryObj } from '@storybook/react'

type Component = typeof Textarea

const meta: Meta<Component> = {
  title: 'Components/Textarea',
  component: Textarea,
  args: {
    placeholder: 'Type something...',
  },

  render: props => (
    <div className="flex w-[300px] flex-col gap-3">
      <h3 className="mb-2 text-15 font-medium">Basic Textarea</h3>
      <Textarea {...props} />

      <h3 className="mb-2 mt-4 text-15 font-medium">Clearable Textarea</h3>
      <Textarea {...props} clearable />

      <h3 className="mb-2 mt-4 text-15 font-medium">Special States</h3>
      <Textarea {...props} isDisabled />
      <Textarea {...props} isInvalid />

      <h3 className="mb-2 mt-4 text-15 font-medium">
        Textarea with Label and Meta
      </h3>
      <Textarea {...props} label="Label" />
      <Textarea {...props} label="Label" maxLength={280} />
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
