<<<<<<< HEAD
import { PendingIcon } from '@status-im/icons'
=======
import { PendingIcon } from '@status-im/icons/12'
import { GroupIcon } from '@status-im/icons/16'
>>>>>>> 668cc1d5 (context tag refactor)
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
  args: { size: 24 },
  render: ({ size }) => (
    <Stack space flexDirection="row">
      <Stack space flexDirection="column" alignItems="flex-start">
        <ContextTag
          type="default"
          user={{
            name: 'User',
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
          }}
          size={size}
        />
        <ContextTag
          type="group"
          group={{
            name: 'Group',
            icon: <GroupIcon />,
          }}
          size={size}
        />
        <ContextTag
          type="channel"
          channel={{
            communityName: 'Rarible',
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            name: 'channel',
          }}
          size={size}
        />
        <ContextTag
          type="community"
          community={{
            name: 'Rarible',
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
          }}
          outline={true}
          size={size}
        />
        <ContextTag
          type="token"
          token={{
            name: '10 ETH',
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
          }}
          size={size}
        />
        <ContextTag
          type="network"
          network={{
            name: 'Network',
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
          }}
          size={size}
        />
        <ContextTag
          type="account"
          user={{
            name: 'User Name',
            emoji: '🐷',
          }}
          size={size}
        />
        <ContextTag
          type="collectible"
          collectible={{
            name: 'Collectible #123',
            src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
          }}
          size={size}
        />
        <ContextTag type="address" address="0x045...1ah" size={size} />
        <ContextTag
          icon={<PendingIcon size={12} />}
          type="icon"
          label="Context"
          outline
          size={size}
        />
        <ContextTag type="audio" audioLength="00:32" size={size} />
      </Stack>
    </Stack>
  ),
}

export default meta
