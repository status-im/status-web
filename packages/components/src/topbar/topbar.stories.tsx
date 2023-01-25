import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'

import { Topbar } from './topbar'

import type { Meta, StoryObj } from '@storybook/react'

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta: Meta<typeof Topbar> = {
  title: 'Navigation/Topbar',
  component: Topbar,
  argTypes: {},
  parameters: {
    viewport: {
      viewports: MINIMAL_VIEWPORTS,
    },
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Web?node-id=7213%3A553827&t=11hKj5jyWVroXgdu-4',
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
