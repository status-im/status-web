import { NftIcon } from '@status-im/icons'
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
          <Tag icon="🐷" label="Tag" size={32} />
          <Tag icon="🐷" label="Tag" size={32} selected />
          <Tag icon="🐷" label="Tag" size={32} disabled />
          <Tag icon="🐷" size={32} />
          <Tag icon={NftIcon} size={32} label="bajoras" />

          <Tag icon="🐷" label="Tag" size={24} />
          <Tag icon="🐷" size={24} />
        </Stack>

        <Stack space alignItems="flex-start">
          <Tag label="Tag" size={32} />
          <Tag label="Tag" size={32} selected />
          <Tag label="Tag" size={32} disabled />

          <Tag label="Tag" size={24} />
          <Tag label="New tag" size={24} disabled selected />
          <Tag label="New tag" size={24} color="#FF7D46" />

          <Tag label="New tag #7140FD" size={24} color="#7140FD" />
          <Tag label="New tag #7140FD" size={24} color="#7140FD" icon="🧙‍♂️" />

          <Tag
            label="New tag rgb(113, 64, 253)"
            size={24}
            color="rgb(113, 64, 253)"
          />
          <Tag
            label="New tag rgb(113, 64, 253)"
            size={24}
            color="rgb(113, 64, 253)"
            icon="🧙‍♂️"
          />
          <Tag
            label="New tag hsl(202, 79%, 47%)"
            size={24}
            color="hsl(202, 79%, 47%)"
          />
          <Tag
            label="New tag hsl(202, 79%, 47%)"
            size={24}
            color="hsl(202, 79%, 47%)"
            icon="🧙‍♂️"
          />
          <Tag
            label="custom color purple"
            size={24}
            icon="🐷"
            color="$purple-50"
          />
          <Tag
            label="New tag with icon"
            size={24}
            color="#FF7D46"
            icon="🥷🏾"
            selected
          />
        </Stack>
      </Stack>
    )
  },
}

export default meta
