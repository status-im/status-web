import { cloneElement } from 'react'

import { Stack, styled } from '@tamagui/core'

import type { Ref } from 'react'

const Base = styled(Stack, {
  name: 'IconButton',
  accessibilityRole: 'button',

  cursor: 'pointer',
  userSelect: 'none',
  borderRadius: 10,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  animation: 'fast',

  width: 30,
  height: 30,
  borderWidth: 1,
  padding: 4,

  variants: {
    variant: {
      default: {
        backgroundColor: '$iconButtonBackground',
        borderColor: 'transparent',

        hoverStyle: {
          backgroundColor: '$iconButtonBackgroundHover',
        },

        pressStyle: {
          backgroundColor: '$iconButtonBackgroundHover',
        },
      },
      outline: {
        backgroundColor: 'transparent',
        borderColor: '$iconButtonOutlineBorder',

        hoverStyle: {
          borderColor: '$iconButtonOutlineBorderHover',
        },

        pressStyle: {
          borderColor: '$iconButtonOutlineBorderHover',
        },
      },
    },
    blurred: {
      default: {
        backgroundColor: '$iconButtonBackgroundBlurred',

        hoverStyle: {
          backgroundColor: '$iconButtonBackgroundBlurredHover',
        },

        pressStyle: {
          backgroundColor: 'iconButtonBackgroundBlurredHover',
        },
      },
      outline: {
        borderColor: '$iconButtonOutlineBorderBlurred',

        hoverStyle: {
          borderColor: '$iconButtonOutlineBorderBlurredHover',
        },

        pressStyle: {
          borderColor: '$iconButtonOutlineBorderBlurredHover',
        },
      },
    },
    selected: {
      default: {
        backgroundColor: '$iconButtonBackgroundSelected',
        borderColor: '$iconButtonBorderSelected',
      },
      defaultWithBlur: {
        backgroundColor: '$iconButtonBackgroundBlurredSelected',
        borderColor: '$iconButtonBorderBlurredSelected',
      },
      outline: {
        backgroundColor: '$iconButtonOutlineBackgroundSelected',
        borderColor: '$iconButtonOutlineBorderSelected',
      },
      outlineWithBlur: {
        backgroundColor: '$iconButtonOutBackgroundBlurredSelected',
        borderColor: '$iconButtonOutlineBorderBlurredSelected',
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

interface Props {
  icon: React.ReactElement
  onPress?: () => void
  selected?: boolean
  blurred?: boolean
  variant?: 'default' | 'outline'
  disabled?: boolean
  // FIXME: enforce aria-label for accessibility
  // 'aria-label'?: string
}

const iconColor = {
  default: {
    default: '$iconButtonColor',
    defaultBlurred: '$iconButtonColorBlurred',
    selected: '$iconButtonColorSelected',
    selectedBlurred: '$iconButtonColorBlurred',
  },
  outline: {
    default: '$iconButtonColorOutline',
    defaultBlurred: '$iconButtonColorOutlineBlurred',
    selected: '$iconButtonColorOutlineSelected',
    selectedBlurred: '$iconButtonColorOutlineBlurred',
  },
}

const getStateForIconColor = ({
  blurred,
  selected,
}: {
  blurred?: boolean
  selected?: boolean
}) => {
  if (!selected && blurred) {
    return 'defaultBlurred'
  }
  if (selected && blurred) {
    return 'selectedBlurred'
  }
  if (selected && !blurred) {
    return 'selected'
  }
  return 'default'
}

const getSelectedVariant = ({
  selected,
  blurred,
  variant,
}: {
  selected?: boolean
  blurred?: boolean
  variant?: 'default' | 'outline'
}) => {
  if (!selected) {
    return undefined
  }
  if (blurred && variant === 'default') {
    return 'defaultWithBlur'
  }
  if (blurred && variant === 'outline') {
    return 'outlineWithBlur'
  }
  return variant
}

const IconButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    icon,

    blurred,

    variant = 'default',
    disabled,
  } = props

  const selected =
    props.selected || props['aria-expanded'] || props['aria-selected']

  const state = getStateForIconColor({ blurred, selected })
  const selectedVariant = getSelectedVariant({ selected, variant, blurred })

  return (
    <Base
      {...rest}
      ref={ref}
      variant={variant}
      selected={selectedVariant}
      blurred={blurred ? variant : undefined}
    >
      {cloneElement(icon, {
        color: iconColor[variant][state],
        size: 20,
      })}
    </Base>
  )
}

const _IconButton = forwardRef(IconButton)

export { _IconButton as IconButton }
export type { Props as IconButtonProps }
