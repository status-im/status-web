import { cloneElement, forwardRef } from 'react'

import { Stack, styled } from '@tamagui/core'

import { Paragraph } from '../typography'

import type { ColorTokens, GetProps } from '@tamagui/core'
import type { Ref } from 'react'

const Base = styled(Stack, {
  tag: 'button',
  name: 'Button',
  accessibilityRole: 'button',

  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  borderWidth: 1,
  borderColor: 'transparent',
  animation: 'fast',

  variants: {
    variant: {
      primary: {
        backgroundColor: '$primary',
        hoverStyle: { backgroundColor: '$primaryHover' },
        pressStyle: { backgroundColor: '#2139B6' },
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
        hoverStyle: { borderColor: '$neutral-40' },
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
        height: 40,
        paddingHorizontal: 16,
        gap: 4,
      },
      32: {
        height: 32,
        paddingHorizontal: 12,
        gap: 4,
      },
      24: {
        height: 24,
        paddingHorizontal: 8,
      },
    },

    radius: {
      full: {
        borderRadius: 40,
      },
      40: {
        borderRadius: 12,
      },
      32: {
        borderRadius: 10,
      },
      24: {
        borderRadius: 8,
      },
    },

    iconOnly: {
      true: {
        gap: 0,
        padding: 0,
        aspectRatio: 1,
      },
    },
  } as const,
})

const ButtonText = styled(Paragraph, {
  display: 'flex',
  alignItems: 'center',
  space: 4,
  weight: 'medium',

  variants: {
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
  variant?: BaseProps['variant']
  shape?: 'default' | 'circle'
  size?: BaseProps['size']
  disabled?: boolean
  icon?: React.ReactElement
  iconAfter?: React.ReactElement
}

const textColors: Record<NonNullable<Props['variant']>, ColorTokens> = {
  primary: '$white-100',
  positive: '$white-100',
  grey: '$neutral-100',
  darkGrey: '$neutral-100',
  outline: '$neutral-100',
  ghost: '$neutral-100',
  danger: '$white-100',
}

const Button = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    variant = 'primary',
    shape = 'default',
    size = 40,
    children,
    icon,
    iconAfter,
    ...rest
  } = props

  // TODO: provider aria-label if button has only icon
  const iconOnly = !children && Boolean(icon)
  const textColor = textColors[variant]

  return (
    <Base
      {...rest}
      ref={ref}
      variant={variant}
      radius={shape === 'circle' ? 'full' : size}
      size={size}
      iconOnly={iconOnly}
    >
      {icon ? cloneElement(icon, { color: textColor }) : null}
      <ButtonText color={textColor} size={size}>
        {children}
      </ButtonText>
      {iconAfter ? cloneElement(iconAfter, { color: textColor }) : null}
    </Base>
  )
}

const _Button = forwardRef(Button)

export { _Button as Button }
export type { Props as ButtonProps }
