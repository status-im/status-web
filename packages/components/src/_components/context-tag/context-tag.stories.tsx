import { MembersIcon, PlaceholderIcon } from '@status-im/icons/20'

import { ContextTag } from './context-tag'

import type { ContextTagProps } from './context-tag'
import type { Meta, StoryObj } from '@storybook/react'

const sizes = ['32', '24', '20'] as const

function Variant(props: ContextTagProps) {
  return (
    <div className="flex items-center gap-4">
      {sizes.map(size => (
        <ContextTag key={size} {...props} size={size} />
      ))}
    </div>
  )
}

const meta = {
  component: ContextTag,
  title: 'Components/ContextTag',
  args: {
    blur: false,
    outline: false,
  },

  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n/Design-System-for-Desktop%2FWeb?node-id=1336%3A34320&mode=dev',
    },
  },

  render: props => (
    <div className="grid gap-4">
      <Variant type="label" {...props}>
        Name
      </Variant>
      {/* <RenderVariant type="user" {...props} user={{ name: 'User', src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images' }} /> */}
      {/* <RenderVariant type="group" {...props} group={{ name: 'Group', icon: <MembersIcon size={12} /> }} /> */}
      {/* <RenderVariant type="channel" {...props} channel={{ communityName: 'Rarible', src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images', name: 'channel' }} /> */}
      <Variant
        type="community"
        {...props}
        community={{
          name: 'Rarible',
          src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
        }}
      />
      <Variant
        type="token"
        {...props}
        token={{
          name: '10 ETH',
          src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
        }}
      />
      <Variant
        type="network"
        {...props}
        network={{
          name: 'Network',
          src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images',
        }}
      />
      {/* <RenderVariant type="account" {...props} account={{ name: 'User Name', emoji: '🐷' }} /> */}
      {/* <RenderVariant type="collectible" {...props} collectible={{ name: 'Collectible #123', src: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.seadn.io%2Fgae%2FFG0QJ00fN3c_FWuPeUr9-T__iQl63j9hn5d6svW8UqOmia5zp3lKHPkJuHcvhZ0f_Pd6P2COo9tt9zVUvdPxG_9BBw%3Fw%3D500%26auto%3Dformat&f=1&nofb=1&ipt=c177cd71d8d0114080cfc6efd3f9e098ddaeb1b347919bd3089bf0aacb003b3e&ipo=images' }} /> */}
      {/* <RenderVariant type="address" {...props} address="0x045...1ah" /> */}
      <Variant type="icon" {...props} icon={PlaceholderIcon} label="Context" />
      {/* <RenderVariant type="audio" {...props} audioLength="00:32" /> */}
    </div>
  ),
} satisfies Meta<typeof ContextTag>

type Story = StoryObj<typeof ContextTag>

export const Light: Story = {}
export const Dark: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
}

export default meta
