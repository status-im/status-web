import { cloneElement, forwardRef } from 'react'

import { Stack, styled } from '@tamagui/core'

import { Text } from '../text'

import type { TextProps } from '../text'
import type { GetVariants, MapVariant, PressableProps } from '../types'
import type { StackProps } from '@tamagui/core'
import type { Ref } from 'react'

type Variants = GetVariants<typeof Base>

type Props = PressableProps & {
  variant?: Variants['variant']
  size?: Variants['size']
  shape?: 'default' | 'circle'
  children?: string
  icon?: React.ReactElement
  iconAfter?: React.ReactElement
  disabled?: boolean
  fullWidth?: boolean
}

const textColors: MapVariant<typeof Base, 'variant'> = {
  primary: '$white-100',
  positive: '$white-100',
  grey: '$neutral-100',
  darkGrey: '$neutral-100',
  outline: '$neutral-100',
  ghost: '$neutral-100',
  danger: '$white-100',
  blue: '$white-100',
  purple: '$white-100',
  orange: '$white-100',
  army: '$white-100',
  turquoise: '$white-100',
  sky: '$white-100',
  yellow: '$white-100',
  pink: '$white-100',
  cooper: '$white-100',
  camel: '$white-100',
  magenta: '$white-100',
  yin: '$white-100',
  yang: '$neutral-100',
}

const textSizes: Record<NonNullable<Props['size']>, TextProps['size']> = {
  '40': 15,
  '32': 15,
  '24': 13,
}

const Button = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    variant = 'primary',
    shape = 'default',
    size = 40,
    children,
    icon,
    iconAfter,
    fullWidth,
    ...buttonProps
  } = props

  // TODO: provider aria-label if button has only icon
  const iconOnly = !children && Boolean(icon)

  const textColor = textColors[variant]
  const textSize = textSizes[size]

  return (
    <Base
      {...(buttonProps as unknown as StackProps)} // TODO: Tamagui has incorrect types for PressableProps
      ref={ref}
      variant={variant}
      radius={shape === 'circle' ? 'full' : size}
      size={size}
      iconOnly={iconOnly}
      width={fullWidth ? '100%' : 'auto'}
    >
      {icon ? cloneElement(icon, { color: textColor || '$neutral-40' }) : null}
      <Text weight="medium" color={textColor} size={textSize}>
        {children}
      </Text>
      {iconAfter ? cloneElement(iconAfter, { color: textColor }) : null}
    </Base>
  )
}

const _Button = forwardRef(Button)

export { _Button as Button }
export type { Props as ButtonProps }

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
        backgroundColor: '$primary-50',
        hoverStyle: { backgroundColor: '$primary-60' },
        // TODO: update background color
        pressStyle: { backgroundColor: '$primary-50' },
      },
      positive: {
        backgroundColor: '$success-50',
        hoverStyle: { backgroundColor: '$success-60' },
        // TODO: update background color
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
        // TODO: update background color
        pressStyle: { backgroundColor: '$danger' },
      },
      // TODO sync colors with the design foundation colors
      blue: {
        backgroundColor: '$blue-50',
        hoverStyle: { backgroundColor: '$blue-60' },
        pressStyle: { backgroundColor: '$blue-50' },
      },
      purple: {
        backgroundColor: '$purple-50',
        hoverStyle: { backgroundColor: '$purple-60' },
        pressStyle: { backgroundColor: '$purple-50' },
      },
      orange: {
        backgroundColor: '$orange-50',
        hoverStyle: { backgroundColor: '$orange-60' },
        pressStyle: { backgroundColor: '$orange-50' },
      },
      army: {
        backgroundColor: '$indigo-50',
        hoverStyle: { backgroundColor: '$indigo-60' },
        pressStyle: { backgroundColor: '$indigo-50' },
      },
      turquoise: {
        backgroundColor: '$turquoise-50',
        hoverStyle: { backgroundColor: '$turquoise-60' },
        pressStyle: { backgroundColor: '$turquoise-50' },
      },
      sky: {
        backgroundColor: '$sky-50',
        hoverStyle: { backgroundColor: '$sky-60' },
        pressStyle: { backgroundColor: '$sky-50' },
      },
      yellow: {
        backgroundColor: '$yellow-50',
        hoverStyle: { backgroundColor: '$yellow-60' },
        pressStyle: { backgroundColor: '$yellow-50' },
      },
      pink: {
        backgroundColor: '$pink-50',
        hoverStyle: { backgroundColor: '$pink-60' },
        pressStyle: { backgroundColor: '$pink-50' },
      },
      cooper: {
        backgroundColor: '$cooper-50',
        hoverStyle: { backgroundColor: '$cooper-60' },
        pressStyle: { backgroundColor: '$cooper-50' },
      },
      camel: {
        backgroundColor: '$camel-50',
        hoverStyle: { backgroundColor: '$camel-60' },
        pressStyle: { backgroundColor: '$camel-50' },
      },
      magenta: {
        backgroundColor: '$magenta',
        hoverStyle: { backgroundColor: '$magenta-60' },
        pressStyle: { backgroundColor: '$magenta-50' },
      },
      yin: {
        backgroundColor: '$yin-50',
        hoverStyle: { backgroundColor: '$yin-60' },
        pressStyle: { backgroundColor: '$yin-50' },
      },
      yang: {
        backgroundColor: '$yang-50',
        hoverStyle: { backgroundColor: '$yang-60' },
        pressStyle: { backgroundColor: '$yang-50' },
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
        gap: 4,
      },
    },

    radius: {
      full: {
        borderRadius: '$full',
      },
      40: {
        borderRadius: '$12',
      },
      32: {
        borderRadius: '$10',
      },
      24: {
        borderRadius: '$8',
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
