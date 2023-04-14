import { Stack } from '@tamagui/core'

import { Avatar } from './avatar'
import { ChannelAvatar } from './channel-avatar'

import type { AvatarProps } from './avatar'
import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Avatar> = {
  component: Avatar,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=102-5246&t=i4haPXGOeNtaLaEz-0',
    },
  },
}

type UserArgs = Pick<
  Extract<AvatarProps, { type: 'user'; src: string }>,
  'type' | 'src'
>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const User: StoryObj<UserArgs> = {
  // todo?: https://github.com/storybookjs/storybook/issues/13747
  args: {
    type: 'user',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  } as UserArgs,
  render: args => (
    <Stack space flexDirection="row">
      <Stack space alignItems="flex-start">
        <Avatar {...args} size={80} />
        <Avatar {...args} size={56} />
        <Avatar {...args} size={48} />
        <Avatar {...args} size={32} />
        <Avatar {...args} size={28} />
        <Avatar {...args} size={24} />
        <Avatar {...args} size={20} />
        <Avatar {...args} size={16} />
      </Stack>

      <Stack space alignItems="flex-start">
        <Avatar {...args} size={80} indicator="online" />
        <Avatar {...args} size={56} indicator="online" />
        <Avatar {...args} size={48} indicator="online" />
        <Avatar {...args} size={32} indicator="online" />
        <Avatar {...args} size={28} indicator="online" />
        <Avatar {...args} size={24} indicator="online" />
        <Avatar {...args} size={20} indicator="online" />
        <Avatar {...args} size={16} indicator="online" />
      </Stack>

      <Stack space alignItems="flex-start">
        <Avatar
          {...args}
          size={80}
          indicator="online"
          colorHash={[
            [3, 30],
            [2, 10],
            [5, 5],
            [3, 14],
            [5, 4],
            [4, 19],
            [3, 16],
            [4, 0],
            [5, 28],
            [4, 13],
            [4, 15],
          ]}
        />
        <Avatar
          {...args}
          size={56}
          indicator="online"
          colorHash={[
            [3, 30],
            [2, 10],
            [5, 5],
            [3, 14],
            [5, 4],
            [4, 19],
            [3, 16],
            [4, 0],
            [5, 28],
            [4, 13],
            [4, 15],
          ]}
        />
        <Avatar
          {...args}
          size={48}
          indicator="online"
          colorHash={[
            [3, 30],
            [2, 10],
            [5, 5],
            [3, 14],
            [5, 4],
            [4, 19],
            [3, 16],
            [4, 0],
            [5, 28],
            [4, 13],
            [4, 15],
          ]}
        />
        <Avatar
          {...args}
          size={32}
          indicator="online"
          colorHash={[
            [3, 30],
            [2, 10],
            [5, 5],
            [3, 14],
            [5, 4],
            [4, 19],
            [3, 16],
            [4, 0],
            [5, 28],
            [4, 13],
            [4, 15],
          ]}
        />
      </Stack>
    </Stack>
  ),
}

export const Account: StoryObj<Extract<AvatarProps, { type: 'account' }>> = {
  args: {
    type: 'account',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  render: args => (
    <Stack space>
      <Avatar {...args} size={80} />
      <Avatar {...args} size={48} />
      <Avatar {...args} size={32} />
      <Avatar {...args} size={28} />
      <Avatar {...args} size={24} />
      <Avatar {...args} size={20} />
    </Stack>
  ),
}

export const Channel: StoryObj<typeof ChannelAvatar> = {
  args: {
    type: 'channel',
    emoji: '🍑',
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space alignItems="flex-start">
        <ChannelAvatar {...args} size={80} />
        <ChannelAvatar {...args} size={32} />
        <ChannelAvatar {...args} size={24} />
        <ChannelAvatar {...args} size={20} />
      </Stack>

      <Stack space alignItems="flex-start">
        <ChannelAvatar {...args} size={32} lock="locked" />
        <ChannelAvatar {...args} size={24} lock="locked" />
        <ChannelAvatar {...args} size={20} lock="locked" />
      </Stack>

      <Stack space alignItems="flex-start">
        <ChannelAvatar {...args} size={32} lock="unlocked" />
        <ChannelAvatar {...args} size={24} lock="unlocked" />
        <ChannelAvatar {...args} size={20} lock="unlocked" />
      </Stack>
    </Stack>
  ),
}

export default meta
