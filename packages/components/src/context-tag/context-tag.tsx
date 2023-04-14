import { cloneElement, Fragment } from 'react'

import { ChevronRightIcon } from '@status-im/icons'
import { styled } from '@tamagui/core'
import { View } from 'react-native'

import { Avatar } from '../avatar'
import { Text } from '../text'

import type { AvatarProps } from '../avatar'
import type { TextProps } from '../text'

type ContextTagType =
  | 'default'
  | 'group'
  | 'channel'
  | 'community'
  | 'token'
  | 'network'
  | 'account'
  | 'collectible'
  | 'address'
  | 'icon'
  | 'audio'

type Props = {
  children?: React.ReactNode
  src?: string
  icon?: React.ReactElement
  label: string | [string, string]
  type?: ContextTagType
  size?: 24 | 32
  blur?: boolean
  outline?: boolean
}

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
    src,
    icon,
    label,
    // type = 'default', // this is commented because it's not being used
    size = 24,
    blur = false,
    outline,
  } = props

  const hasImg = Boolean(src || icon)

  return (
    <Base outline={outline} size={size} hasImg={hasImg} blur={blur}>
      {src && <Avatar type="user" size={avatarSizes[size]} src={src} />}
      {icon && cloneElement(icon, { color: '$neutral-50' })}

      {Array.isArray(label) ? (
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
      )}
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
      24: props => {
        // there is only first param which is "size" and hasImg doesn't exist here
        return {
          space: 4,
          paddingLeft: props.hasImg ? 8 : 2,
          paddingRight: 8,
        }
      },
      32: ({ hasImg }) => ({
        // this therefore doesn't work as well
        space: 8,
        paddingLeft: hasImg ? 12 : 2,
        paddingRight: 12,
      }),
    },
    hasImg: {
      true: {},
      false: {},
    }, // to correctly infer the type of the variant
  } as const,
})
