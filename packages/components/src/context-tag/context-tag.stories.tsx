import { PinIcon } from '@status-im/icons/20'

import { List } from '../utils'
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

export const Full: Story = {
  args: {
    icon: <PinIcon />,
    children: 'ContextTag message',
    count: 5,
  },
}

export const NoIcon: Story = {
  args: {
    children: 'ContextTag message',
    count: 5,
  },
}

export const NoCount: Story = {
  args: {
    icon: <PinIcon />,
    children: 'ContextTag message',
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <List>
      <ContextTag icon={<PinIcon />} count={5}>
        ContextTag message
      </ContextTag>
      <ContextTag count={5}>ContextTag message</ContextTag>
      <ContextTag icon={<PinIcon />}>ContextTag message</ContextTag>
    </List>
  ),
}

export default meta
