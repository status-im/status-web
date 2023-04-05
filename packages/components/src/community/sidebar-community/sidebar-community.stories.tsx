import { CHANNEL_GROUPS } from '../mock-data'
import { SidebarCommunity } from './sidebar-community'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SidebarCommunity> = {
  title: 'Community/Community Sidebar',
  component: SidebarCommunity,
  args: {
    community: {
      name: 'Rarible',
      description:
        'Multichain community-centric NFT marketplace. Create, buy and sell your NFTs.',
      membersCount: 123,
      imageSrc:
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2264&q=80',
    },
    channels: CHANNEL_GROUPS,
  },
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=14692%3A148489&t=NfQkS7CPSrZknAGF-4',
    },
  },
  render: args => (
    <div style={{ maxWidth: 360 }}>
      <SidebarCommunity {...args} />
    </div>
  ),
}

type Story = StoryObj<typeof SidebarCommunity>

export const Default: Story = {
  args: {},
}

export const Loading: Story = {
  args: {
    loading:true
  },
}

export default meta
