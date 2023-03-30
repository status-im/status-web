import { Stack } from 'tamagui'

import { DividerNewMessages } from './divider-new-messages'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof DividerNewMessages> = {
  component: DividerNewMessages,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=5626-159391&t=mgkcemjDOjfGvZZ2-11',
    },
  },
}

type Story = StoryObj<typeof DividerNewMessages>

export const Default: Story = {
  args: {},
  render: () => {
    return (
      <Stack gap={24}>
        <DividerNewMessages color="$primary-50" />
        <DividerNewMessages color="$yellow-50" />
        <DividerNewMessages color="$turquoise-50" />
        {/* <NewMessages color="$cooper-50" /> */}
        {/* <NewMessages color="$sky-50" /> */}
        {/* <NewMessages color="$camel-50" /> */}
        <DividerNewMessages color="$orange-50" />
        {/* <NewMessages color="$army-50" /> */}
        <DividerNewMessages color="$pink-50" />
        <DividerNewMessages color="$purple-50" />
        {/* <NewMessages color="$magenta-50" /> */}
        {/* <NewMessages color="$yin-50" /> */}
      </Stack>
    )
  },
}

export default meta
