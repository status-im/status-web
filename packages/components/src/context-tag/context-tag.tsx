import { cloneElement } from 'react'

import { ChevronRightIcon, PlayIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

import type { AvatarProps } from '../avatar'
import type { TextProps } from '../text'
import type { IconProps } from '@status-im/icons'

type Props = { blur?: boolean; outline?: boolean } & (
  | {
      size?: 20 | 32
    }
  | {
      size?: 24
      textSize: 13 | 15
    }
) &
  (
    | { type: 'user'; user: { name: string; src: string } }
    | { type: 'account'; account: { name: string; emoji: string } }
    | {
        type: 'group'
        group: {
          name: string
          icon: React.ReactElement
        }
      }
    | { type: 'community'; community: { name: string; src?: string } }
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
    | { type: 'label'; children: string }
  )

const textSizes: Record<
  Exclude<NonNullable<Props['size']>, 24>,
  TextProps['size']
> = {
  '32': 15,
  /**
   * note: "These context sizes are the same size as the ones above (24px), but the text size differs.
   * We can have a bigger or smaller text depending on the context."
   *
   * – https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n?node-id=1336:34320&mode=design#541570513
   */
  // '24': 15,
  '20': 13,
}

const avatarSizes: Record<
  NonNullable<Props['size']>,
  Extract<AvatarProps['size'], 28 | 20 | 16>
> = {
  '32': 28,
  '24': 20,
  '20': 16,
}

const iconSizes: Record<NonNullable<Props['size']>, IconProps['size']> = {
  '32': 20,
  '24': 12,
  '20': 12,
}

const Label = (props: {
  children: string
  size: 20 | 24 | 32
  type?: 'default' | 'monospace'
  textSize?: 13 | 15
}) => {
  const { children, size, type = 'default' } = props

  const textSize = size === 24 ? props.textSize! : textSizes[size]

  return (
    <Text size={textSize} weight="medium" color="$neutral-100" type={type}>
      {children}
    </Text>
  )
}

const ContextTag = (props: Props) => {
  const { size = 24, blur = false, outline, type } = props

  const rounded = type === 'account' || type === 'collectible'
  const hasAvatar = type !== 'address' && type !== 'icon' && type !== 'label'
  const textSize = 'textSize' in props ? props.textSize : undefined

  const renderContent = () => {
    switch (type) {
      case 'user': {
        return (
          <>
            <Avatar
              type="user"
              size={avatarSizes[size]}
              src={props.user.src}
              name={props.user.name}
            />
            <Label size={size} textSize={textSize}>
              {props.user.name}
            </Label>
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
            <Label size={size} textSize={textSize}>
              {props.community.name}
            </Label>
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
              <Label size={size} textSize={textSize}>
                {props.channel.communityName}
              </Label>
              <ChevronRightIcon color="$neutral-50" size={20} />
              <Label size={size} textSize={textSize}>
                {`# ` + props.channel.name}
              </Label>
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
            <Label size={size} textSize={textSize}>
              {props.token.name}
            </Label>
          </>
        )
      }
      case 'address': {
        return (
          <Label size={size} textSize={textSize} type="monospace">
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
            <Label size={size} textSize={textSize}>
              {props.audioLength}
            </Label>
          </>
        )
      }
      case 'account': {
        return (
          <>
            <Avatar
              type="account"
              size={avatarSizes[size]}
              name={props.account.emoji}
            />
            <Label size={size} textSize={textSize}>
              {props.account.name}
            </Label>
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
            <Label size={size} textSize={textSize}>
              {props.group.name}
            </Label>
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
            <Label size={size} textSize={textSize}>
              {props.network.name}
            </Label>
          </>
        )
      }
      case 'collectible': {
        return (
          <>
            {/* fixme: not an avatar but a resized image; see https://www.figma.com/file/IBmFKgGL1B4GzqD8LQTw6n?node-id=1336:34320&mode=design#541620575 */}
            <Avatar
              type="account"
              size={avatarSizes[size]}
              src={props.collectible.src}
              name={props.collectible.name}
            />
            <Label size={size} textSize={textSize}>
              {props.collectible.name}
            </Label>
          </>
        )
      }
      case 'icon': {
        return (
          <>
            {cloneElement(props.icon, {
              size: iconSizes[size],
              color: '$neutral-50',
            })}
            <Label size={size} textSize={textSize}>
              {props.label}
            </Label>
          </>
        )
      }
      case 'label': {
        return (
          <Label size={size} textSize={textSize}>
            {props.children}
          </Label>
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
      textSize={textSize}
      {...(hasAvatar && { paddingLeft: 1 })}
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
      20: {
        height: 20,
        gap: 4,
        paddingHorizontal: 6,
      },
      24: {
        height: 24,
        gap: 4,
      },
      32: {
        height: 32,
        gap: 8,
        paddingHorizontal: 12,
      },
    },
    textSize: {
      13: {
        paddingHorizontal: 8,
      },
      15: {
        paddingHorizontal: 6,
      },
    },
  } as const,
})
