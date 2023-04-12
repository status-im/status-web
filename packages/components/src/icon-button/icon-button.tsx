import { cloneElement, forwardRef } from 'react'

import { Stack, styled } from 'tamagui'

import { usePressableColors } from '../hooks/use-pressable-colors'

import type { GetVariants, PressableProps } from '../types'
import type { Ref } from 'react'

type Variants = GetVariants<typeof Base>

type Props = PressableProps & {
  icon: React.ReactElement
  variant?: Variants['variant']
  selected?: boolean
  blur?: boolean
  disabled?: boolean
  // FIXME: enforce aria-label for accessibility
  // 'aria-label'?: string
  // FIXME: update to latest RN
  'aria-expanded'?: boolean
  'aria-selected'?: boolean
}

const IconButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { icon, blur, variant = 'default', ...buttonProps } = props

  const { pressableProps, color } = usePressableColors(
    {
      dark: blur ? '$neutral-80-opa-10' : '$neutral-100',
      default: blur ? '$neutral-80-opa-70' : '$neutral-50',
      hover: blur ? '$neutral-80-opa-70' : '$neutral-50',
      press: '$neutral-100',
      active: '$neutral-100',
    },
    props
  )

  const selected =
    props.selected || props['aria-expanded'] || props['aria-selected']

  return (
    <Base
      {...(buttonProps as unknown as object)} // TODO: Tamagui has incorrect types for PressableProps
      {...pressableProps}
      ref={ref}
      variant={blur ? undefined : variant}
      active={blur ? undefined : selected ? variant : undefined}
      variantBlur={blur ? variant : undefined}
      activeBlur={blur ? (selected ? variant : undefined) : undefined}
    >
      {cloneElement(icon, {
        color,
        size: 20,
      })}
    </Base>
  )
}

const _IconButton = forwardRef(IconButton)

export { _IconButton as IconButton }
export type { Props as IconButtonProps }

const Base = styled(Stack, {
  name: 'IconButton',
  tag: 'button',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: '$10',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 4,
  width: 32,
  height: 32,
  borderWidth: 1,
  borderColor: 'transparent',
  animation: 'fast',

  variants: {
    variant: {
      dark: {
        backgroundColor: '$neutral-80',
        borderColor: '$neutral-80',
        hoverStyle: { backgroundColor: '$neutral-70' },
        pressStyle: {
          backgroundColor: '$neutral-70',
          borderColor: '$neutral-70',
        },
      },
      default: {
        backgroundColor: '$neutral-10',
        borderColor: 'transparent',
        hoverStyle: { backgroundColor: '$neutral-20' },
        pressStyle: {
          backgroundColor: '$neutral-20',
          borderColor: '$neutral-30',
        },
      },

      outline: {
        backgroundColor: 'transparent',
        borderColor: '$neutral-20',
        hoverStyle: { borderColor: '$neutral-30' },
        pressStyle: {
          borderColor: '$neutral-20',
          backgroundColor: '$neutral-10',
        },
      },

      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: { backgroundColor: '$neutral-10' },
        pressStyle: {
          backgroundColor: '$neutral-10',
          borderColor: '$neutral-20',
        },
      },
    },

    active: {
      dark: {
        backgroundColor: '$neutral-70',
        borderColor: '$neutral-70',
      },
      default: {
        backgroundColor: '$neutral-20',
        borderColor: '$neutral-30',
      },

      outline: {
        borderColor: '$neutral-20',
        backgroundColor: '$neutral-10',
      },

      ghost: {
        backgroundColor: '$neutral-10',
        borderColor: '$neutral-20',
      },
    },

    variantBlur: {
      dark: {
        backgroundColor: '$neutral-80-opa-5',
        borderColor: '$neutral-80-opa-5',
        hoverStyle: { backgroundColor: '$neutral-80-opa-10' },
        pressStyle: {
          backgroundColor: '$neutral-80-opa-10',
          borderColor: '$neutral-80-opa-10',
        },
      },
      default: {
        backgroundColor: '$neutral-80-opa-5',
        borderColor: 'transparent',
        hoverStyle: { backgroundColor: '$neutral-80-opa-10' },
        pressStyle: {
          backgroundColor: '$neutral-80-opa-10',
          borderColor: '$neutral-80-opa-5',
        },
      },

      outline: {
        backgroundColor: 'transparent',
        borderColor: '$neutral-80-opa-10',
        hoverStyle: { borderColor: '$neutral-80-opa-20' },
        pressStyle: {
          borderColor: '$neutral-80-opa-10',
          backgroundColor: '$neutral-80-opa-5',
        },
      },

      ghost: {
        backgroundColor: 'transparent',
        hoverStyle: { backgroundColor: '$neutral-80-opa-5' },
        pressStyle: {
          backgroundColor: '$neutral-80-opa-5',
          borderColor: '$neutral-80-opa-10',
        },
      },
    },

    activeBlur: {
      dark: {
        backgroundColor: '$neutral-80-opa-10',
        borderColor: '$neutral-80-opa-10',
      },
      default: {
        backgroundColor: '$neutral-80-opa-10',
        borderColor: '$neutral-80-opa-5',
      },

      outline: {
        borderColor: '$neutral-80-opa-10',
        backgroundColor: '$neutral-80-opa-5',
      },

      ghost: {
        backgroundColor: '$neutral-80-opa-5',
        borderColor: '$neutral-80-opa-10',
      },
    },

    disabled: {
      true: {
        opacity: 0.3,
        cursor: 'default',
      },
    },
  } as const,
})
