import { ContextTag } from './context-tag'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ContextTag> = {
  component: ContextTag,
  argTypes: {
    children: {
      control: 'text',
    },
  },
}

type Story = StoryObj<typeof ContextTag>

export const AllVariants: Story = {
  args: { children: 'ContextTag' },
  render: ({ children }) => <ContextTag>{children}</ContextTag>,
}

export default meta
