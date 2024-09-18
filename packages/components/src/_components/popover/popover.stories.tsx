import { Button } from '../button'
import { Popover } from './'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Popover',
  render: props => (
    <Popover.Root {...props}>
      <Button variant="primary">Trigger</Button>
      <Popover.Content className="p-4">some content</Popover.Content>
    </Popover.Root>
  ),
} satisfies Meta<typeof Popover>

type Story = StoryObj<typeof Popover>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
