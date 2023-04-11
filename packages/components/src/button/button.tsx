import { cloneElement, forwardRef } from 'react'

import { Stack, styled } from '@tamagui/core'

import { Text, TEXT_SIZES } from '../text'

// import type { TextProps } from '../text'
import type {
  GetVariants,
  MapVariant,
  PressableProps,
  TextSizeVariant,
} from '../types'
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
}

const textColors: MapVariant<typeof Base, 'variant'> = {
  primary: '$white-100',
  positive: '$white-100',
  grey: '$neutral-100',
  darkGrey: '$neutral-100',
  outline: '$neutral-100',
  ghost: '$neutral-100',
  danger: '$white-100',
}

const textSizes: TextSizeVariant<Props['size']> = {
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
    >
      {icon ? cloneElement(icon, { color: textColor }) : null}
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
