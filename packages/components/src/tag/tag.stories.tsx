import { Stack } from '@tamagui/core'

import { Tag } from './tag'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Tag> = {
  component: Tag,
  argTypes: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=180-9685&t=tDEqIV09qddTZgXF-4',
    },
  },
}

type Story = StoryObj<typeof Tag>

export const Default: Story = {
  render: () => {
    return (
      <Stack space flexDirection="row">
        <Stack space alignItems="flex-start">
          <Tag emoji="🐷" label="Tag" size={32} />
          <Tag emoji="🐷" label="Tag" size={32} selected />
          <Tag emoji="🐷" label="Tag" size={32} disabled />
          <Tag emoji="🐷" size={32} />

          <Tag emoji="🐷" label="Tag" size={24} />
          <Tag emoji="🐷" size={24} />
        </Stack>

        <Stack space alignItems="flex-start">
          <Tag label="Tag" size={32} />
          <Tag label="Tag" size={32} selected />
          <Tag label="Tag" size={32} disabled />

          <Tag label="Tag" size={24} />
        </Stack>
      </Stack>
    )
  },
}

export default meta
