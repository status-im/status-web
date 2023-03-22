import { Stack } from 'tamagui'

import { Shadow } from './shadow'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Shadow> = {
  component: Shadow,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/v98g9ZiaSHYUdKWrbFg9eM/Foundations?node-id=624-752&t=ppNe6QC4ntgNciqw-11',
    },
  },
}

export default meta

type Story = StoryObj<typeof Shadow>

export const Default: Story = {
  args: {},
  render: () => (
    <Stack gap={40} flexDirection="row">
      <Shadow
        variant="$1"
        width={50}
        height={50}
        borderWidth={1}
        borderColor="$neutral-20"
        borderRadius={12}
      />
      <Shadow
        variant="$2"
        width={50}
        height={50}
        borderWidth={1}
        borderColor="$neutral-20"
        borderRadius={12}
      />
      <Shadow
        variant="$3"
        width={50}
        height={50}
        borderWidth={1}
        borderColor="$neutral-20"
        borderRadius={12}
      />
      <Shadow
        variant="$4"
        width={50}
        height={50}
        borderWidth={1}
        borderColor="$neutral-20"
        borderRadius={12}
      />
    </Stack>
  ),
}
