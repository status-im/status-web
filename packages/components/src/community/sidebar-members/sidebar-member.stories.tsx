import { SidebarMembers } from './sidebar-members'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof SidebarMembers> = {
  title: 'Community/Members Sidebar',
  component: SidebarMembers,
  args: {},
  argTypes: {},
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <SidebarMembers />
    </div>
  ),
}

type Story = StoryObj<typeof SidebarMembers>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {},
}

export default meta
