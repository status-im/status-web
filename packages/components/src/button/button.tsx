import { Stack, styled } from '@tamagui/core'

import { Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'
// import { Pressable } from 'react-native'

const Base = styled(Stack, {
  name: 'Button',
  accessibilityRole: 'button',

  borderRadius: 12,
  display: 'flex',
  paddingHorizontal: 16,
  paddingTop: 7,
  paddingBottom: 9,
  cursor: 'pointer',

  alignItems: 'center',
  animation: 'fast',
  userSelect: 'none',

  variants: {
    type: {
      primary: {
        backgroundColor: '$primary',
        hoverStyle: { backgroundColor: '$primaryHover' },
        pressStyle: { backgroundColor: '$primaryHover' },
      },
      positive: {
        backgroundColor: '$success',
        hoverStyle: { backgroundColor: '$successHover' },
        pressStyle: { backgroundColor: '$successHover' },
      },
      outline: {
        borderWidth: 1,
        borderColor: '$neutral-30',
        hoverStyle: { borderColor: '$neutral-30' },
        pressStyle: { borderColor: '$neutral-50' },
      },
      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: { backgroundColor: '$neutral-10' },
        pressStyle: { backgroundColor: '$neutral-20' },
      },
    },

    size: {
      40: {
        paddingHorizontal: 16,
        paddingTop: 7,
        paddingBottom: 9,
      },
      32: {
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 6,
      },
    },

    iconOnly: {
      true: {
        paddingHorizontal: 8,
      },
    },
  } as const,
})

const ButtonText = styled(Paragraph, {
  textAlign: 'center',
  weight: 'medium',
  display: 'flex',
  alignItems: 'center',
  space: 4,

  variants: {
    type: {
      primary: {
        color: '$white-100',
      },
      positive: {
        color: '$white-100',
      },
      outline: {
        color: '$neutral-100',
      },
      ghost: {
        color: '$neutral-100',
      },
    },
  } as const,
})

type BaseProps = GetProps<typeof Base>

type Props = BaseProps & {
  children?: string
  icon?: React.ReactNode
  type?: BaseProps['type']
  size?: BaseProps['size']
  iconAfter?: React.ReactNode
  onPress?: () => void
}

const Button = (props: Props) => {
  const {
    type = 'primary',
    size = 40,
    children,
    onPress,
    icon,
    iconAfter,
    ...rest
  } = props

  const iconOnly = !children && Boolean(icon)

  return (
    <Base
      {...rest}
      type={type}
      size={size}
      iconOnly={iconOnly}
      onPress={onPress}
    >
      <ButtonText type={type}>
        {icon}
        {children}
        {iconAfter}
      </ButtonText>
    </Base>
  )
}

export { Button }
export type { Props as ButtonProps }
