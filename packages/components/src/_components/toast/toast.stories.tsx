import { PlaceholderIcon } from '@status-im/icons/20'

import { Button } from '../button'
import { Toast, ToastContainer, useToast } from './'

import type { Meta, StoryObj } from '@storybook/react'

const Actions = () => {
  const toast = useToast()

  return (
    <div className="flex gap-4">
      <Button variant="positive" onPress={() => toast.positive('Hello World')}>
        Positive
      </Button>
      <Button variant="danger" onPress={() => toast.negative('Hello World')}>
        Negative
      </Button>
      <Button
        variant="grey"
        onPress={() => toast.custom('Custom message', <PlaceholderIcon />)}
      >
        Custom
      </Button>
    </div>
  )
}

const meta = {
  component: Toast,
  title: 'Components/Toast',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=3928-77581&node-type=frame&m=dev',
    },
  },
  render: () => {
    return (
      <div className="grid grid-cols-2 gap-4">
        <div className="grid gap-4">
          <Toast
            type="negative"
            message="You can only add 6 photos to your message"
          />
          <Toast
            type="positive"
            message="Great success! This means good stuff!"
          />
          <Toast icon={<PlaceholderIcon />} message="Something happened" />
          <Toast
            type="negative"
            action="Retry"
            message="Couldn't fetch information"
          />
          <Toast
            type="negative"
            message="You can only add 6 photos to your message and something more"
          />
          <Toast
            type="negative"
            action="Retry"
            message="You can only add 6 photos to your message and something more"
          />
        </div>
        <Actions />
      </div>
    )
  },
  decorators: [
    Story => (
      <>
        <Story />
        <ToastContainer />
      </>
    ),
  ],
} satisfies Meta<typeof Toast>

type Story = StoryObj<typeof Toast>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
