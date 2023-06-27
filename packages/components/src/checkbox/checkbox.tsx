import { Indicator as _Indicator, Root } from '@radix-ui/react-checkbox'
import { CheckIcon } from '@status-im/icons'
import { styled } from '@tamagui/core'

import type { GetVariants } from '../types'
import type { IconProps } from '@status-im/icons'
import type { ColorTokens } from '@tamagui/core'

type Variants = GetVariants<typeof Base>

interface Props {
  selected?: boolean
  onCheckedChange?: (checked: boolean) => void
  id: string
  size?: 32 | 20
  variant?: Variants['variant']
}

const iconColor: Record<Variants['variant'], ColorTokens> = {
  filled: '$neutral-50',
  outline: '$white-100',
}

const iconSize: Record<Variants['size'], IconProps['size']> = {
  32: 20,
  20: 16,
}

const Checkbox = (props: Props) => {
  const { id, selected, onCheckedChange, size = 20, variant = 'filled' } = props

  return (
    <Base
      id={id}
      selected={selected ? variant : undefined}
      size={size}
      onCheckedChange={onCheckedChange}
      variant={variant}
      checked={selected}
    >
      <Indicator>
        <CheckIcon size={iconSize[size]} color={iconColor[variant]} />
      </Indicator>
    </Base>
  )
}

export { Checkbox }
export type { Props as CheckboxProps }

const Base = styled(Root, {
  name: 'Checkbox',
  tag: 'span',
  accessibilityRole: 'checkbox',

  backgroundColor: 'transparent',
  borderRadius: '$2',

  cursor: 'pointer',
  animation: 'fast',

  height: 32,
  width: 32,
  borderWidth: 1,

  variants: {
    size: {
      32: {
        height: 32,
        width: 32,
      },
      20: {
        height: 20,
        width: 20,
      },
    },
    variant: {
      filled: {
        backgroundColor: '$neutral-20',

        hoverStyle: { backgroundColor: '$neutral-30' },
        pressStyle: { backgroundColor: '$neutral-30' },
      },
      outline: {
        borderColor: '$neutral-20',

        hoverStyle: { borderColor: '$neutral-30' },
        pressStyle: { borderColor: '$neutral-30' },
      },
    },
    selected: {
      filled: {
        hoverStyle: { backgroundColor: '$primary-60' },
        pressStyle: { backgroundColor: '$primary-60' },
      },
      outline: {
        backgroundColor: '$primary-50',
        borderColor: '$primary-50',

        hoverStyle: {
          backgroundColor: '$primary-60',
        },
        pressStyle: {
          backgroundColor: '$primary-60',
        },
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

const Indicator = styled(_Indicator, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  width: '100%',
})
