import { PlaceholderIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { Button } from '../button'
import { Toast, useToast } from './'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Toast> = {
  component: Toast,
  args: {},
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=3928-77614&t=hp2XwjFgrFl3hhDm-4',
    },
  },
}

type Story = StoryObj<typeof Toast>

const ToastWithHook = () => {
  const toast = useToast()

  return (
    <Button
      size={32}
      onPress={() => toast.positive('Great success! This means good stuff!')}
    >
      Show Toast
    </Button>
  )
}

export const Default: Story = {
  args: {},
  render: () => (
    <Stack space flexDirection="row">
      <ToastWithHook />
    </Stack>
  ),
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space>
      <Toast
        type="negative"
        message="You can only add 6 photos to your message"
      />
      <Toast type="positive" message="Great success! This means good stuff!" />
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
    </Stack>
  ),
}

export default meta
