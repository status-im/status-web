import { forwardRef } from 'react'

import { Stack, styled } from '@tamagui/core'

import { Paragraph } from '../typography'

import type { GetProps } from '@tamagui/core'
import type { Ref } from 'react'

const Base = styled(Stack, {
  name: 'Button',
  accessibilityRole: 'button',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  space: 4,
  paddingHorizontal: 16,
  paddingTop: 7,
  paddingBottom: 9,

  cursor: 'pointer',
  userSelect: 'none',
  animation: 'fast',
  borderWidth: 1,
  borderColor: 'transparent',

  variants: {
    type: {
      primary: {
        backgroundColor: '$primary',
        hoverStyle: { backgroundColor: '$primaryHover' },
        pressStyle: { backgroundColor: '$primaryHover' },
      },
      positive: {
        backgroundColor: '$success-50',
        hoverStyle: { backgroundColor: '$success-60' },
        pressStyle: { backgroundColor: '$success-50' },
      },
      grey: {
        backgroundColor: '$neutral-10',
        hoverStyle: { backgroundColor: '$neutral-20' },
        pressStyle: { backgroundColor: '$neutral-30' },
      },
      darkGrey: {
        backgroundColor: '$neutral-20',
        hoverStyle: { backgroundColor: '$neutral-30' },
        pressStyle: { backgroundColor: '$neutral-40' },
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
      danger: {
        backgroundColor: '$danger',
        hoverStyle: { backgroundColor: '$danger-60' },
        pressStyle: { backgroundColor: '$danger' },
      },
    },

    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'default',
      },
    },

    size: {
      40: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingTop: 7,
        paddingBottom: 9,
      },
      32: {
        borderRadius: 10,
        paddingHorizontal: 16,
        paddingTop: 4,
        paddingBottom: 6,
      },
      24: {
        borderRadius: 8,
        paddingHorizontal: 8,
        paddingTop: 2,
        paddingBottom: 4,
      },
    },

    iconOnly: {
      true: {
        space: 0,
        paddingHorizontal: 8,
      },
    },
  } as const,
})

const ButtonText = styled(Paragraph, {
  display: 'flex',
  alignItems: 'center',
  weight: 'medium',

  variants: {
    type: {
      primary: {
        color: '$white-100',
      },
      positive: {
        color: '$white-100',
      },
      grey: {
        color: '$neutral-100',
      },
      darkGrey: {
        color: '$neutral-100',
      },
      outline: {
        color: '$neutral-100',
      },
      ghost: {
        color: '$neutral-100',
      },
      danger: {
        color: '$white-100',
      },
    },

    size: {
      40: {
        variant: 'normal',
      },
      32: {
        variant: 'normal',
      },
      24: {
        variant: 'smaller',
      },
    },
  } as const,
})

type BaseProps = GetProps<typeof Base>

type Props = BaseProps & {
  children?: string
  type?: BaseProps['type']
  size?: BaseProps['size']
  disabled?: boolean
  icon?: React.ReactNode
  iconAfter?: React.ReactNode
}

const Button = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    type = 'primary',
    size = 40,
    children,
    icon,
    iconAfter,
    ...rest
  } = props

  const iconOnly = !children && Boolean(icon)

  return (
    <Base {...rest} ref={ref} type={type} size={size} iconOnly={iconOnly}>
      {icon}
      <ButtonText type={type} size={size}>
        {children}
      </ButtonText>
      {iconAfter}
    </Base>
  )
}

const _Button = forwardRef(Button)

export { _Button as Button }
export type { Props as ButtonProps }
