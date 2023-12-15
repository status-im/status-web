import { PlaceholderIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'

import { Avatar } from './avatar'

import type {
  AccountAvatarProps,
  ChannelAvatarProps,
  CommunityAvatarProps,
  GroupAvatarProps,
  IconAvatarProps,
  UserAvatarProps,
  WalletAvatarProps,
} from './avatar'
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

type UserArgs = Pick<UserAvatarProps, 'type' | 'src' | 'name'>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const User: StoryObj<UserArgs> = {
  // todo?: https://github.com/storybookjs/storybook/issues/13747
  args: {
    type: 'user',
    name: 'John Doe',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  } as UserArgs,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=115-6787&t=kcsW0DN5ochMPO1u-4',
    },
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space flexDirection="column">
        <Stack space flexDirection="row">
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
          <Stack space flexDirection="column">
            <Stack space alignItems="flex-start">
              <Avatar
                {...args}
                src={undefined}
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
                src={undefined}
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
                src={undefined}
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
                src={undefined}
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
        </Stack>
        <Stack space alignItems="flex-start">
          <Avatar {...args} size={80} indicator="online" />
          <Avatar {...args} size={56} indicator="online" />
          <Avatar {...args} size={48} indicator="online" />
          <Avatar {...args} size={32} indicator="online" />
          <Avatar {...args} size={28} indicator="online" />
          <Avatar {...args} size={24} indicator="online" />
        </Stack>
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
            <Avatar {...args} src={undefined} size={80} />
            <Avatar {...args} src={undefined} size={56} />
            <Avatar {...args} src={undefined} size={48} />
            <Avatar {...args} src={undefined} size={32} />
            <Avatar {...args} src={undefined} size={28} />
            <Avatar {...args} src={undefined} size={24} />
            <Avatar {...args} src={undefined} size={20} />
            <Avatar {...args} src={undefined} size={16} />
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  ),
}

export const Group: StoryObj<GroupAvatarProps> = {
  args: {
    type: 'group',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=14584-169312&t=kcsW0DN5ochMPO1u-4',
    },
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space flexDirection="column">
        <Avatar {...args} size={80} />
        <Avatar {...args} size={48} />
        <Avatar {...args} size={32} />
        <Avatar {...args} size={28} />
        <Avatar {...args} size={20} />
      </Stack>
      <Stack space flexDirection="column">
        <Avatar {...args} src={undefined} size={80} />
        <Avatar {...args} src={undefined} size={48} />
        <Avatar {...args} src={undefined} size={32} />
        <Avatar {...args} src={undefined} size={28} />
        <Avatar {...args} src={undefined} size={20} />
      </Stack>
    </Stack>
  ),
}

export const Wallet: StoryObj<WalletAvatarProps> = {
  args: {
    type: 'wallet',
    name: 'Wallet 1',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=114-7646&t=kcsW0DN5ochMPO1u-4',
    },
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space flexDirection="column">
        <Avatar {...args} size={80} />
        <Avatar {...args} size={48} />
        <Avatar {...args} size={32} />
        <Avatar {...args} size={28} />
        <Avatar {...args} size={20} />
      </Stack>
    </Stack>
  ),
}

export const Account: StoryObj<AccountAvatarProps> = {
  args: {
    type: 'account',
    name: 'My Account',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=483-19401&t=kcsW0DN5ochMPO1u-4',
    },
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

export const community: StoryObj<CommunityAvatarProps> = {
  args: {
    type: 'community',
    src: 'https://images.unsplash.com/photo-1518020382113-a7e8fc38eac9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&h=500&q=80',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=8824-149725&t=kcsW0DN5ochMPO1u-4',
    },
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space alignItems="flex-start">
        <Avatar {...args} size={32} />
        <Avatar {...args} size={24} />
        <Avatar {...args} size={20} />
      </Stack>
    </Stack>
  ),
}

type ChannelArgs = Pick<ChannelAvatarProps, 'type' | 'emoji' | 'name'>

export const Channel: StoryObj<ChannelArgs> = {
  args: {
    type: 'channel',
    name: 'random',
    emoji: '🍑',
  } as ChannelArgs,
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=399-20709&t=kcsW0DN5ochMPO1u-4',
    },
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space alignItems="flex-start">
        <Avatar {...args} size={80} />
        <Avatar {...args} size={32} />
        <Avatar {...args} size={24} />
        <Avatar {...args} size={20} />
      </Stack>

      <Stack space alignItems="flex-start">
        <Avatar {...args} size={32} lock="locked" />
        <Avatar {...args} size={24} lock="locked" />
        <Avatar {...args} size={20} lock="locked" />
      </Stack>

      <Stack space alignItems="flex-start">
        <Avatar {...args} size={32} lock="unlocked" />
        <Avatar {...args} size={24} lock="unlocked" />
        <Avatar {...args} size={20} lock="unlocked" />
      </Stack>
    </Stack>
  ),
}

export const Icon: StoryObj<IconAvatarProps> = {
  args: {
    type: 'icon',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=2931-44944&t=kcsW0DN5ochMPO1u-4',
    },
  },
  render: args => (
    <Stack space flexDirection="row">
      <Stack space alignItems="flex-start">
        <Avatar {...args} size={48} icon={<PlaceholderIcon size={20} />} />
        <Avatar {...args} size={32} icon={<PlaceholderIcon size={16} />} />
        <Avatar {...args} size={20} icon={<PlaceholderIcon size={12} />} />
      </Stack>
    </Stack>
  ),
}

export default meta
