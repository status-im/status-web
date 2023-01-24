import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'

import { Topbar } from './topbar'

import type { Meta, StoryObj } from '@storybook/react'

console.log(MINIMAL_VIEWPORTS)

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Topbar> = {
  title: 'Navigation/Topbar',
  component: Topbar,
  argTypes: {},
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
  },
}

type Story = StoryObj<typeof Topbar>

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Default: Story = {
  args: {
    title: '# channel',
    description: 'This is a channel description',
  },
}

export const WithMembersSelected: Story = {
  args: {
    ...Default.args,
    membersVisisble: true,
  },
}

export const WithGoBack: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile2',
    },
  },
  args: {
    ...Default.args,
    goBack: () => {
      // do nothing
    },
  },
}

export default meta
