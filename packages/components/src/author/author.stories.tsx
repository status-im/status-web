import { Author } from './author'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Author> = {
  component: Author,
  argTypes: {},
  args: {
    name: 'Alisher Yakupov',
  },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Web?node-id=3155%3A49848&t=87Ziud3PyYYSvsRg-4',
    },
  },
}

type Story = StoryObj<typeof Author>

export const Default: Story = {
  args: {},
}

export const Contact: Story = {
  args: {
    status: 'contact',
  },
}

export const Verified: Story = {
  args: {
    status: 'verified',
  },
}

export const Untrustworthy: Story = {
  args: {
    status: 'untrustworthy',
  },
}

export default meta
