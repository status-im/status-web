import { PendingIcon } from '@status-im/icons/12'
import { Stack } from '@tamagui/core'

import { ContextTag } from './context-tag'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ContextTag> = {
  component: ContextTag,
  argTypes: {
    label: {
      control: ['Rarible', '# channel-name'],
    },
    size: [24, 32],
    outline: [true, false],
    blur: [true, false],
  },
}

type Story = StoryObj<typeof ContextTag>

export const Base: Story = {
  args: { label: 'Name', size: 24, outline: false, blur: false },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space flexDirection="row">
      <Stack space flexDirection="column" alignItems="flex-start">
        <ContextTag label="Name" />
        <ContextTag type="group" label="Group" />
        <ContextTag
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
          type="channel"
          label={['Rarible', '# channel']}
        />
        <ContextTag
          src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images"
          type="community"
          label="Coinbase"
          outline={true}
        />
        <ContextTag type="token" label="10 ETH" />
        <ContextTag type="network" label="Network" />
        <ContextTag type="account" label="Account Name" />
        <ContextTag type="collectible" label="Collectible #123" />
        <ContextTag type="address" label="0x045...1ah" />
        <ContextTag
          icon={<PendingIcon />}
          type="icon"
          label="Context"
          outline
        />
        <ContextTag type="audio" label="00:32" />
      </Stack>
    </Stack>
  ),
}

export default meta
