import { Button } from '../button'
import { Sheet } from './sheet'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Sheet> = {
  // title: 'Messages',
  component: Sheet,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=611%3A36006&t=Gyy71OAckl3b2TWj-4',
    },
  },
}

type Story = StoryObj<typeof Sheet>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
  render: args => (
    <Sheet {...args}>
      <Button>Trigger</Button>
      <Sheet.Content>hello</Sheet.Content>
    </Sheet>
  ),
}

export default meta
