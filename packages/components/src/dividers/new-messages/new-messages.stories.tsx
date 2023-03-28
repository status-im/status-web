import { Stack } from 'tamagui'

import { NewMessages } from './new-messages'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof NewMessages> = {
  component: NewMessages,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=5626-159391&t=mgkcemjDOjfGvZZ2-11',
    },
  },
}

type Story = StoryObj<typeof NewMessages>

export const Default: Story = {
  args: {},
  render: () => {
    return (
      <Stack gap={24}>
        <NewMessages color="$primary-50" />
        <NewMessages color="$yellow-50" />
        <NewMessages color="$turquoise-50" />
        {/* <NewMessages color="$cooper-50" /> */}
        {/* <NewMessages color="$sky-50" /> */}
        {/* <NewMessages color="$camel-50" /> */}
        <NewMessages color="$orange-50" />
        {/* <NewMessages color="$army-50" /> */}
        <NewMessages color="$pink-50" />
        <NewMessages color="$purple-50" />
        {/* <NewMessages color="$magenta-50" /> */}
        {/* <NewMessages color="$yin-50" /> */}
      </Stack>
    )
  },
}

export default meta
