import { cloneElement } from 'react'

import { ChevronRightIcon } from '@status-im/icons'
import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

import type { AvatarProps } from '../avatar'
import type { TextProps } from '../text'

type ContextTagType =
  | 'account'
  | 'group'
  | 'community'
  | 'channel'
  | 'token'
  | 'network'
  | 'collectible'
  | 'address'
  | 'icon'
  | 'audio'

type Props = {
  children?: React.ReactNode
  size?: 24 | 32
  blur?: boolean
  outline?: boolean
} & (
  | { type: 'account'; user: { name: string; src: string } }
  | {
      type: 'group'
      groupName: 'string'
      icon: React.ReactElement
    }
  | { type: 'community'; communityName: string }
  | { type: 'channel'; communityName: string; channelName: string }
  | { type: 'token'; tokenName: string; src: string }
  | { type: 'network'; networkName: string; src: string }
  | { type: 'collectible'; collectibleName: string; src: string }
  | { type: 'address'; label: string }
  | { type: 'icon'; icon: React.ReactElement; label: string }
  | { type: 'audio'; audioLength: number }
)

const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
  '32': 15,
  '24': 13,
}

const avatarSizes: Record<NonNullable<Props['size']>, AvatarProps['size']> = {
  '32': 28,
  '24': 20,
}

const Label = ({ children, size }: { children: string; size: 24 | 32 }) => (
  <Text size={textSizes[size]} weight="medium" color="$neutral-100">
    {children}
  </Text>
)

const ContextTag = (props: Props) => {
  const {
    // type = 'default', // this is commented because it's not being used
    size = 24,
    blur = false,
    outline,
    user,
    icon,
    type,
  } = props

  const renderContent = (type: ContextTagType) => {
    switch (type) {
      case 'community': {
        return <Label size={size}>{props.communityName}</Label>
      }
      case 'channel': {
        return (
          <>
            <Label size={size}>{props.communityName}</Label>
            <ChevronRightIcon color="$neutral-50" />
            <Label size={size}>{props.channelName}</Label>
          </>
        )
      }
      case 'token': {
        return <Label size={size}>{props.tokenName}</Label>
      }
      case 'address': {
        return <Label size={size}>{props.label}</Label>
      }
      case 'audio': {
        return (
          <>
            <AudioIcon color="$neutral-50" />
            <Label size={size}>{props.audioLength}</Label>
          </>
        )
      }
      case 'account': {
        return (
          <>
            <Avatar size={avatarSizes[size]} src={user.src} />
            <Label size={size}>{user.name}</Label>
          </>
        )
      }
      case 'group': {
        return (
          <>
            {icon && cloneElement(icon, { color: '$neutral-50' })}
            <Label size={size}>{props.groupName}</Label>
          </>
        )
      }
      case 'network': {
        return <Label size={size}>{props.networkName}</Label>
      }
      case 'collectible': {
        return <Label size={size}>{props.collectibleName}</Label>
      }
      case 'icon': {
        return <>{icon && cloneElement(icon, { color: '$neutral-50' })}</>
      }
    }
  }

  return (
    <Base outline={outline} size={size} blur={blur}>
      {src && <Avatar type="user" name="" size={avatarSizes[size]} src={src} />}
      {icon && cloneElement(icon, { color: '$neutral-50' })}

      {renderContent(type)}

      {/* {Array.isArray(label) ? (
        label.map((item, i) => {
          if (i !== 0) {
            return (
              <Fragment key={item}>
                <ChevronRightIcon size={16} color="$neutral-50" />
                <Label size={size}>{item}</Label>
              </Fragment>
            )
          } else {
            return (
              <Label size={size} key={item}>
                {item}
              </Label>
            )
          }
        })
      ) : (
        <Label size={size}>{label}</Label>
      )} */}
    </Base>
  )
}

export { ContextTag }
export type { Props as ContextTagProps }

const Base = styled(View, {
  backgroundColor: '$neutral-10',
  paddingVertical: 1,
  borderRadius: '$20',
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
      24: {
        space: 4,
        paddingHorizontal: 8,
      },
      32: {
        space: 8,
        paddingHorizontal: 12,
      },
    },
  } as const,
})
