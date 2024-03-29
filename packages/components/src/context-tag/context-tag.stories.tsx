import { MembersIcon, PlaceholderIcon } from '@status-im/icons'
import { Stack } from 'tamagui'

import { ContextTag } from './context-tag'

import type { Meta, StoryObj } from '@storybook/react'

const meta: Meta<typeof ContextTag> = {
  component: ContextTag,
  argTypes: {
    type: [
      'user',
      'account',
      'group',
      'community',
      'channel',
      'token',
      'network',
      'collectible',
      'address',
      'icon',
      'audio',
    ],
    size: [24, 32],
    outline: [true, false],
    blur: [true, false],
  },
}

type Story = StoryObj<typeof ContextTag>

export const user: Story = {
  args: {
    type: 'account',
    account: { name: 'user name ', emoji: '🐷' },
    size: 24,
    outline: false,
    blur: false,
  },
}

export const AllVariants: Story = {
  args: {},
  render: () => (
    <Stack space flexDirection="row">
      <Stack space flexDirection="column" alignItems="flex-start" gap={12}>
        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={20}>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={20}
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={20}
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={20}
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
          />
          <ContextTag type="address" address="0x045...1ah" size={20} />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={20}
          />
          <ContextTag type="audio" audioLength="00:32" size={20} />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={24} textSize={13}>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
          />
          <ContextTag
            type="address"
            address="0x045...1ah"
            size={24}
            textSize={13}
          />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={24}
            textSize={13}
          />
          <ContextTag
            type="audio"
            audioLength="00:32"
            size={24}
            textSize={13}
          />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={24} textSize={15}>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
          />
          <ContextTag
            type="address"
            address="0x045...1ah"
            size={24}
            textSize={15}
          />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={24}
            textSize={15}
          />
          <ContextTag
            type="audio"
            audioLength="00:32"
            size={24}
            textSize={15}
          />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={32}>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={16} />,
            }}
            size={32}
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={32}
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={32}
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
          />
          <ContextTag type="address" address="0x045...1ah" size={32} />
          <ContextTag
            icon={<PlaceholderIcon size={16} />}
            type="icon"
            label="Context"
            size={32}
          />
          <ContextTag type="audio" audioLength="00:32" size={32} />
        </Stack>
      </Stack>

      <Stack space flexDirection="column" alignItems="flex-start" gap={12}>
        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={20} outline>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            outline
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={20}
            outline
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={20}
            outline
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            outline
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            outline
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            outline
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={20}
            outline
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            outline
          />
          <ContextTag type="address" address="0x045...1ah" size={20} outline />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={20}
            outline
          />
          <ContextTag type="audio" audioLength="00:32" size={20} outline />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={24} textSize={13} outline>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="address"
            address="0x045...1ah"
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={24}
            textSize={13}
            outline
          />
          <ContextTag
            type="audio"
            audioLength="00:32"
            size={24}
            textSize={13}
            outline
          />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={24} textSize={15} outline>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="address"
            address="0x045...1ah"
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={24}
            textSize={15}
            outline
          />
          <ContextTag
            type="audio"
            audioLength="00:32"
            size={24}
            textSize={15}
            outline
          />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={32} outline>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            outline
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={16} />,
            }}
            size={32}
            outline
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={32}
            outline
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            outline
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            outline
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            outline
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={32}
            outline
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            outline
          />
          <ContextTag type="address" address="0x045...1ah" size={32} outline />
          <ContextTag
            icon={<PlaceholderIcon size={16} />}
            type="icon"
            label="Context"
            size={32}
            outline
          />
          <ContextTag type="audio" audioLength="00:32" size={32} outline />
        </Stack>
      </Stack>

      <Stack space flexDirection="column" alignItems="flex-start" gap={12}>
        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={20} blur>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            blur
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={20}
            blur
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={20}
            blur
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            blur
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            blur
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            blur
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={20}
            blur
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={20}
            blur
          />
          <ContextTag type="address" address="0x045...1ah" size={20} blur />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={20}
            blur
          />
          <ContextTag type="audio" audioLength="00:32" size={20} blur />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={24} textSize={13} blur>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="address"
            address="0x045...1ah"
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={24}
            textSize={13}
            blur
          />
          <ContextTag
            type="audio"
            audioLength="00:32"
            size={24}
            textSize={13}
            blur
          />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={24} textSize={15} blur>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={12} />,
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="address"
            address="0x045...1ah"
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            icon={<PlaceholderIcon size={12} />}
            type="icon"
            label="Context"
            size={24}
            textSize={15}
            blur
          />
          <ContextTag
            type="audio"
            audioLength="00:32"
            size={24}
            textSize={15}
            blur
          />
        </Stack>

        <Stack space flexDirection="column" alignItems="flex-start">
          <ContextTag type="label" size={32} blur>
            Name
          </ContextTag>
          <ContextTag
            type="user"
            user={{
              name: 'User',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            blur
          />
          <ContextTag
            type="group"
            group={{
              name: 'Group',
              icon: <MembersIcon size={16} />,
            }}
            size={32}
            blur
          />
          <ContextTag
            type="channel"
            channel={{
              communityName: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
              name: 'channel',
            }}
            size={32}
            blur
          />
          <ContextTag
            type="community"
            community={{
              name: 'Rarible',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            blur
          />
          <ContextTag
            type="token"
            token={{
              name: '10 ETH',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            blur
          />
          <ContextTag
            type="network"
            network={{
              name: 'Network',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            blur
          />
          <ContextTag
            type="account"
            account={{
              name: 'User Name',
              emoji: '🐷',
            }}
            size={32}
            blur
          />
          <ContextTag
            type="collectible"
            collectible={{
              name: 'Collectible #123',
              src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
            }}
            size={32}
            blur
          />
          <ContextTag type="address" address="0x045...1ah" size={32} blur />
          <ContextTag
            icon={<PlaceholderIcon size={16} />}
            type="icon"
            label="Context"
            size={32}
            blur
          />
          <ContextTag type="audio" audioLength="00:32" size={32} blur />
        </Stack>
      </Stack>
    </Stack>
  ),
}

export default meta
