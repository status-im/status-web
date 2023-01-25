import { Composer } from './composer'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Composer> = {
  component: Composer,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/qSIh8wh9EVdY8S2sZce15n/Composer-for-Web?node-id=7131%3A360528&t=11hKj5jyWVroXgdu-4',
    },
  },
}

type Story = StoryObj<typeof Composer>

export const Default: Story = {
  args: {},
}

export default meta
