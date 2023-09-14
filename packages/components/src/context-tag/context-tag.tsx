import { cloneElement } from 'react'

import { ChevronRightIcon, PlayIcon } from '@status-im/icons'
import { Stack, styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

import type { AvatarProps } from '../avatar'
import type { TextProps } from '../text'
import type { IconProps } from '@status-im/icons'
import type { ComponentProps } from 'react'

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
  Extract<TextProps['size'], 13 | 15>
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

const chevronIconSize: Record<
  NonNullable<Props['size']>,
  ComponentProps<typeof ChevronRightIcon>['size']
> = {
  '32': 20,
  '24': 16,
  '20': 12,
}

const Label = (props: {
  children: string
  size: 13 | 15
  type?: 'default' | 'monospace'
}) => {
  const { children, size, type = 'default' } = props

  return (
    <Text size={size} weight="medium" color="$neutral-100" type={type}>
      {children}
    </Text>
  )
}

const ContextTag = (props: Props) => {
  const { size = 24, blur = false, outline, type } = props

  const rounded = type === 'account' || type === 'collectible'
  const hasAvatar = type !== 'address' && type !== 'icon' && type !== 'label'

  let textSize: Extract<TextProps['size'], 13 | 15>
  let paddingHorizontal: number | undefined
  if (size === 24) {
    textSize = 'textSize' in props ? props.textSize : 13 // default if props.size not set but fallbacked to 24
    paddingHorizontal = textSize === 13 ? 8 : 6
  } else {
    textSize = textSizes[size]
  }

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
            <Label size={textSize}>{props.user.name}</Label>
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
            <Label size={textSize}>{props.community.name}</Label>
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
              <Label size={textSize}>{props.channel.communityName}</Label>
              <ChevronRightIcon
                color="$neutral-50"
                size={chevronIconSize[size]}
              />
              <Label size={textSize}>{`# ` + props.channel.name}</Label>
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
            <Label size={textSize}>{props.token.name}</Label>
          </>
        )
      }
      case 'address': {
        return (
          <Label size={textSize} type="monospace">
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
            <Label size={textSize}>{props.audioLength}</Label>
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
            <Label size={textSize}>{props.account.name}</Label>
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
            <Label size={textSize}>{props.group.name}</Label>
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
            <Label size={textSize}>{props.network.name}</Label>
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
            <Label size={textSize}>{props.collectible.name}</Label>
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
            <Label size={textSize}>{props.label}</Label>
          </>
        )
      }
      case 'label': {
        return <Label size={textSize}>{props.children}</Label>
      }
    }
  }

  return (
    <Base
      outline={outline}
      blur={blur}
      borderRadius={rounded ? '$8' : '$full'}
      size={size}
      {...(paddingHorizontal && { paddingHorizontal })}
      {...(hasAvatar && { paddingLeft: 2 })}
      {...(hasAvatar && outline && { paddingLeft: 1 })}
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

  variants: {
    outline: {
      true: {
        borderWidth: '1px',
        borderColor: '$primary-50',
        borderStyle: 'solid',
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
  } as const,
})
