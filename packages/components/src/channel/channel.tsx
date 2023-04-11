import { useState } from 'react'

import { MutedIcon, NotificationIcon, OptionsIcon } from '@status-im/icons/20'
import { Stack, styled } from 'tamagui'

import { ChannelAvatar } from '../avatar'
import { Counter } from '../counter'
import { DropdownMenu } from '../dropdown-menu'
import { Text } from '../text'

import type { ChannelAvatarProps } from '../avatar'
import type { ColorTokens } from 'tamagui'

type Props = {
  children: string
  selected: boolean
  emoji: ChannelAvatarProps['emoji']
  lock?: ChannelAvatarProps['lock']
  mentionCount?: number
} & (
  | {
      type: 'default' | 'notification' | 'muted'
    }
  | {
      type: 'mention'
      mentionCount: number
    }
)

const textColors: Record<Props['type'], ColorTokens> = {
  default: '$neutral-50',
  notification: '$neutral-100',
  mention: '$neutral-100',
  muted: '$neutral-40',
}

const Channel = (props: Props) => {
  const { type, children, selected, emoji, lock } = props

  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const active = hovered || menuOpen

  const renderContent = () => {
    if (active) {
      return (
        <DropdownMenu onOpenChange={setMenuOpen}>
          <Stack tag="button" width={20} height={20}>
            <OptionsIcon color="$neutral-50" />
          </Stack>

          {/* TODO: Find all options */}
          <DropdownMenu.Content align="start">
            <DropdownMenu.Item
              icon={<MutedIcon />}
              label="Mute channel"
              onSelect={() => {
                console.log('Mute channel')
              }}
            />
            <DropdownMenu.Item
              icon={<MutedIcon />}
              label="Mark as read"
              onSelect={() => {
                console.log('Mark as read')
              }}
            />
          </DropdownMenu.Content>
        </DropdownMenu>
      )
    }

    switch (type) {
      case 'default':
        return null
      case 'mention': {
        const { mentionCount } = props
        return <Counter value={mentionCount} />
      }
      case 'notification':
        return <NotificationIcon color="$neutral-40" />
      case 'muted':
        return <MutedIcon color="$neutral-40" />
    }
  }

  const textColor: ColorTokens =
    selected || active ? '$neutral-100' : textColors[type]

  return (
    <Base
      onHoverIn={() => setHovered(true)}
      onHoverOut={() => setHovered(false)}
      state={active ? 'active' : selected ? 'selected' : undefined}
    >
      <Stack flexDirection="row" gap={8} alignItems="center">
        <ChannelAvatar emoji={emoji} size={24} lock={lock} />
        <Text size={15} weight="medium" color={textColor}>
          # {children}
        </Text>
      </Stack>

      {renderContent()}
    </Base>
  )
}

export { Channel }
export type { Props as ChannelProps }

const Base = styled(Stack, {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: 8,
  borderRadius: '$12',
  userSelect: 'none',

  variants: {
    state: {
      active: {
        backgroundColor: '$primary-50-opa-5',
      },
      selected: {
        backgroundColor: '$primary-50-opa-10',
      },
    },
  },
})
