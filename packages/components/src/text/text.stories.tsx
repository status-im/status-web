import { Stack } from '@tamagui/core'

import { Text } from './text'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta = {
  title: 'text',

  args: {
    children: 'The quick brown fox jumped over the lazy dog.',
  },
  argTypes: {},

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=617-208&t=ppNe6QC4ntgNciqw-11',
    },
  },
}

export const Default: StoryObj<typeof Text> = {
  render: args => (
    <Stack gap={24}>
      <Stack gap={8}>
        <Text {...args} size={27} weight="regular" />
        <Text {...args} size={27} weight="medium" />
        <Text {...args} size={27} weight="semibold" />
      </Stack>
      <Stack gap={8}>
        <Text {...args} size={19} weight="regular" />
        <Text {...args} size={19} weight="medium" />
        <Text {...args} size={19} weight="semibold" />
      </Stack>

      <Stack gap={8}>
        <Text {...args} size={15} weight="regular" />
        <Text {...args} size={15} weight="medium" />
        <Text {...args} size={15} weight="semibold" />
      </Stack>

      <Stack gap={8}>
        <Text {...args} size={13} weight="regular" />
        <Text {...args} size={13} weight="medium" />
        <Text {...args} size={13} weight="semibold" />
      </Stack>

      <Stack gap={8}>
        <Text {...args} size={11} weight="regular" />
        <Text {...args} size={11} weight="medium" />
        <Text {...args} size={11} weight="semibold" />
        <Text {...args} size={11} weight="regular" uppercase />
        <Text {...args} size={11} weight="medium" uppercase />
        <Text {...args} size={11} weight="semibold" uppercase />
      </Stack>
    </Stack>
  ),
}

export default meta
