import { Stack } from '@tamagui/core'

import { Counter } from './counter'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Counter> = {
  component: Counter,
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

type Story = StoryObj<typeof Counter>

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
    <Stack space flexDirection="row">
      <Stack space>
        <Counter type="default" value={5} />
        <Counter type="secondary" value={5} />
        <Counter type="grey" value={5} />
        <Counter type="outline" value={5} />
      </Stack>
      <Stack space>
        <Counter type="default" value={10} />
        <Counter type="secondary" value={10} />
        <Counter type="grey" value={10} />
        <Counter type="outline" value={10} />
      </Stack>
      <Stack space>
        <Counter type="default" value={100} />
        <Counter type="secondary" value={100} />
        <Counter type="grey" value={100} />
        <Counter type="outline" value={100} />
      </Stack>
    </Stack>
  ),
}

export default meta
