import { action } from '@storybook/addon-actions'
import { Stack } from '@tamagui/core'

import { SystemMessage } from './system-message'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof SystemMessage> = {
  component: SystemMessage,
  argTypes: {
    type: {
      control: 'select',
      options: ['deleted', 'pinned', 'added'],
    },
  },
}

type Story = StoryObj<typeof SystemMessage>

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space flexDirection="row" width={800}>
      <Stack space minWidth={800}>
        <SystemMessage
          type="deleted"
          text="Message deleted for you"
          timestamp="9:45"
        />
        <SystemMessage
          type="deleted"
          text="Message deleted for everyone"
          timestamp="10:31"
        />
        <SystemMessage
          timestamp="11:12"
          type="deleted"
          text="Message deleted"
          action={{ label: 'Undo', onClick: action('undo') }}
        />
        <SystemMessage
          type="pinned"
          actor={{ id: '123', name: 'Steve', src: '' }}
          timestamp="9:45"
          message={{
            text: 'This is a pinned message',
            author: {
              id: '321',
              name: 'Alisher',
              src: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
            },
          }}
        />
        {/* generate SystemMessage component added type with list of three users */}
        <SystemMessage
          type="added"
          timestamp="9:41"
          actor={{ id: '123', name: 'Steve', src: '' }}
          users={[
            {
              id: '425',
              name: 'Peter',
              src: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
            },
            {
              id: '426',
              name: 'John',
              src: 'https://images.unsplash.com/photo-1524638431109-93d95c968f03?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=500&ixid=MnwxfDB8MXxyYW5kb218MHx8Z2lybHx8fHx8fDE2NzM4ODQ0NzU&ixlib=rb-4.0.3&q=80&utm_campaign=api-credit&utm_medium=referral&utm_source=unsplash_source&w=500',
            },
          ]}
        />
      </Stack>
    </Stack>
  ),
}

export default meta
