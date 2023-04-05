import { Stack } from '@tamagui/core'

import { CHANNEL_GROUPS } from './mock-data'
import { Sidebar } from './sidebar'

import type { SidebarProps } from './sidebar'
import type { Meta } from '@storybook/react'

const COMMUNITY = {
  name: 'Rarible',
  description:
    'Multichain community-centric NFT marketplace. Create, buy and sell your NFTs.',
  membersCount: 123,
  imageUrl:
    'https://images.unsplash.com/photo-1574786527860-f2e274867c91?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1764&q=80',
}

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Sidebar> = {
  title: 'Sidebar/Community',
  component: Sidebar,
  args: {
    channels: CHANNEL_GROUPS,
    community: COMMUNITY,
  },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=14692%3A148489&t=NfQkS7CPSrZknAGF-4',
    },
  },
}

export const Default = {
  render: (args: SidebarProps) => (
    <Stack width={352} height="100vh">
      <Sidebar {...args} />
    </Stack>
  ),
}

export const LoadingSidebar = {
  render: (args: SidebarProps) => (
    <Stack width={352} height="100vh">
      <Sidebar {...args} isLoading />
    </Stack>
  ),
}

export default meta
