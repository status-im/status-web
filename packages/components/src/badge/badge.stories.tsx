import { List, Lists } from '../utils'
import { Badge } from './badge'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Badge> = {
  component: Badge,
  argTypes: {
    value: {
      control: {
        type: 'number',
        min: 0,
        max: 1000,
      },
    },
    type: {
      control: 'select',
      options: ['default', 'secondary', 'grey', 'outline'],
    },
  },
}

type Story = StoryObj<typeof Badge>

export const Default: Story = {
  args: {
    value: 5,
    type: 'default',
  },
}

export const Secondary: Story = {
  args: {
    value: 5,
    type: 'secondary',
  },
}

export const Grey: Story = {
  args: {
    value: 5,
    type: 'grey',
  },
}

export const Outline: Story = {
  args: {
    value: 5,
    type: 'outline',
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Lists>
      <List>
        <Badge type="default" value={5} />
        <Badge type="secondary" value={5} />
        <Badge type="grey" value={5} />
        <Badge type="outline" value={5} />
      </List>
      <List>
        <Badge type="default" value={10} />
        <Badge type="secondary" value={10} />
        <Badge type="grey" value={10} />
        <Badge type="outline" value={10} />
      </List>
      <List>
        <Badge type="default" value={100} />
        <Badge type="secondary" value={100} />
        <Badge type="grey" value={100} />
        <Badge type="outline" value={100} />
      </List>
    </Lists>
  ),
}

export default meta
