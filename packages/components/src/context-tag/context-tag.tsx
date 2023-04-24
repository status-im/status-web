import { ChevronRightIcon, PlayIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

import type { TextProps } from '../text'

type Props = {
  children?: React.ReactNode
  size?: 24 | 32
  blur?: boolean
  outline?: boolean
} & (
  | { type: 'default'; user: { name: string; src: string } }
  | { type: 'account'; user: { name: string; emoji: string } }
  | {
      type: 'group'
      group: {
        name: string
        icon: React.ReactElement
      }
    }
  | { type: 'community'; community: { name: string; src: string } }
  | {
      type: 'channel'
      channel: { communityName: string; src: string; name: string }
    }
  | { type: 'token'; token: { name: string; src: string } }
  | { type: 'network'; network: { name: string; src: string } }
  | { type: 'collectible'; collectible: { name: string; src: string } }
  | { type: 'address'; address: string }
  | { type: 'icon'; icon: React.ReactElement; label: string }
  | { type: 'audio'; audioLength: string }
)

const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
  '32': 15,
  '24': 13,
}

const avatarSizes: Record<NonNullable<Props['size']>, 28 | 20> = {
  '32': 28,
  '24': 20,
}

const Label = ({
  children,
  size,
  type = 'default',
}: {
  children: string
  size: 24 | 32
  type?: 'default' | 'monospace'
}) => (
  <Text size={textSizes[size]} weight="medium" color="$neutral-100" type={type}>
    {children}
  </Text>
)

const ContextTag = (props: Props) => {
  const { size = 24, blur = false, outline, type } = props

  const rounded = type === 'account' || type === 'collectible'
  const leftShelf = type !== 'address'

  const renderContent = () => {
    switch (type) {
      case 'default': {
        return (
          <>
            <Avatar
              type="user"
              size={avatarSizes[size]}
              src={props.user.src}
              name={props.user.name}
            />
            <Label size={size}>{props.user.name}</Label>
          </>
        )
      }
      case 'community': {
        return (
          <>
            <Avatar
              type="community"
              size={avatarSizes[size]}
              src={props.community.src}
              name={props.community.name}
            />
            <Label size={size}>{props.community.name}</Label>
          </>
        )
      }
      case 'channel': {
        return (
          <>
            <Avatar
              type="community"
              size={avatarSizes[size]}
              src={props.channel.src}
              name={props.channel.name}
            />
            <Stack flexDirection="row" gap="$0" alignItems="center">
              <Label size={size}>{props.channel.communityName}</Label>
              <ChevronRightIcon color="$neutral-50" size={20} />
              <Label size={size}>{`# ` + props.channel.name}</Label>
            </Stack>
          </>
        )
      }
      case 'token': {
        return (
          <>
            <Avatar
              type="community"
              size={avatarSizes[size]}
              src={props.token.src}
              name={props.token.name}
            />
            <Label size={size}>{props.token.name}</Label>
          </>
        )
      }
      case 'address': {
        return (
          <Label size={size} type="monospace">
            {props.address}
          </Label>
        )
      }
      case 'audio': {
        return (
          <>
            <Avatar
              type="icon"
              size={avatarSizes[size]}
              icon={<PlayIcon size={16} />}
              backgroundColor="$primary-50"
              color="$white-100"
            />
            <Label size={size}>{props.audioLength}</Label>
          </>
        )
      }
      case 'account': {
        return (
          <>
            <Avatar
              type="account"
              size={avatarSizes[size]}
              name={props.user.emoji}
            />
            <Label size={size}>{props.user.name}</Label>
          </>
        )
      }
      case 'group': {
        return (
          <>
            <Avatar
              type="icon"
              size={avatarSizes[size]}
              backgroundColor="$purple-50"
              color="$white-70"
              icon={props.group.icon}
            />
            <Label size={size}>{props.group.name}</Label>
          </>
        )
      }
      case 'network': {
        return (
          <>
            <Avatar
              type="community"
              size={avatarSizes[size]}
              src={props.network.src}
              name={props.network.name}
            />
            <Label size={size}>{props.network.name}</Label>
          </>
        )
      }
      case 'collectible': {
        return (
          <>
            <Avatar
              type="account"
              size={avatarSizes[size]}
              src={props.collectible.src}
              name={props.collectible.name}
            />
            <Label size={size}>{props.collectible.name}</Label>
          </>
        )
      }
      case 'icon': {
        return (
          <>
            <Avatar
              type="icon"
              size={avatarSizes[size]}
              icon={props.icon}
              backgroundColor="$transparent"
              color="$neutral-50"
            />
            <Label size={size}>{props.label}</Label>
          </>
        )
      }
    }
  }

  return (
    <Base
      outline={outline}
      blur={blur}
      borderRadius={rounded ? '$8' : '$full'}
      size={size}
      gap={size === 24 ? 4 : 8}
      paddingVertical={leftShelf ? 0 : 1}
      paddingHorizontal={size === 24 ? 8 : 12}
      paddingLeft={leftShelf ? 1 : size === 24 ? 8 : 12}
    >
      {renderContent()}
    </Base>
  )
}

export { ContextTag }
export type { Props as ContextTagProps }

const Base = styled(View, {
  backgroundColor: '$neutral-10',
  display: 'inline-flex',
  flexDirection: 'row',
  alignItems: 'center',
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: 'transparent',

  variants: {
    outline: {
      true: {
        borderColor: '$primary-50',
      },
      false: {
        borderColor: 'transparent',
      },
    },
    blur: {
      true: {
        backgroundColor: '$neutral-80-opa-5',
      },
      false: {
        backgroundColor: '$neutral-10',
      },
    },
    size: {
      '...': (size: number) => {
        return {
          height: size,
        }
      },
    },
  } as const,
})
