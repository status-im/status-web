import { Stack } from 'tamagui'

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

  render: args => (
    <Stack gap={8}>
      <Author {...args} />
      <Author {...args} status="verified" />
      <Author {...args} status="untrustworthy" />
      <Author {...args} status="contact" />
    </Stack>
  ),
}

type Story = StoryObj<typeof Author>

export const AllVariants: Story = {
  args: {},
  render: args => (
    <Stack gap={20}>
      <Stack gap={8}>
        <Author {...args} />
        <Author {...args} status="verified" />
        <Author {...args} status="untrustworthy" />
        <Author {...args} status="contact" />
      </Stack>

      <Stack gap={8}>
        <Author {...args} address="zQ3...9d4Gs0" />
        <Author {...args} status="verified" address="zQ3...9d4Gs0" />
        <Author {...args} status="untrustworthy" address="zQ3...9d4Gs0" />
        <Author {...args} status="contact" address="zQ3...9d4Gs0" />
      </Stack>

      <Stack gap={8}>
        <Author {...args} address="zQ3...9d4Gs0" time="09:30" />
        <Author
          {...args}
          status="verified"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="untrustworthy"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="contact"
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
      </Stack>

      <Stack gap={8}>
        <Author
          {...args}
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="verified"
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="untrustworthy"
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="contact"
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
      </Stack>

      <Stack gap={8}>
        <Author
          {...args}
          size={15}
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="verified"
          size={15}
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="untrustworthy"
          size={15}
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
        <Author
          {...args}
          status="contact"
          size={15}
          nickname="alisher.eth"
          address="zQ3...9d4Gs0"
          time="09:30"
        />
      </Stack>
    </Stack>
  ),
}

export default meta
