import { CommandIcon } from '@status-im/icons'
import { Stack } from 'tamagui'

import { Shortcut } from './shortcut'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof Shortcut> = {
  component: Shortcut,
  argTypes: {},
  args: {},
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?type=design&node-id=14367-153939&t=Gfv7STEike06c9nm-11',
    },
  },
}

export default meta

type Story = StoryObj<typeof Shortcut>

export const Default: Story = {
  args: {},
  render: () => (
    <Stack gap={20} flexDirection="column">
      <Stack gap={8} flexDirection="row">
        <Shortcut icon={CommandIcon} />
        <Shortcut symbol="K" />
      </Stack>
      <Stack gap={8} flexDirection="row">
        <Shortcut variant="secondary" icon={CommandIcon} />
        <Shortcut variant="secondary" symbol="K" />
      </Stack>

      <Stack gap={8} flexDirection="row">
        <Shortcut variant="gray" icon={CommandIcon} />
        <Shortcut variant="gray" symbol="K" />
      </Stack>
    </Stack>
  ),
}
