import { Button } from '../button'
import { Popover } from './popover'

import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  component: Popover,
  title: 'Components/Popover',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=611%3A36006&t=Gyy71OAckl3b2TWj-4',
    },
  },
  render: props => (
    <Popover {...props}>
      <Button variant="primary">Trigger</Button>
      <Popover.Content>some content</Popover.Content>
    </Popover>
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
