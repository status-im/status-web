import { cloneElement, forwardRef } from 'react'

import { cva } from 'cva'
import * as Aria from 'react-aria-components'

import type { IconComponent } from '../types'
import type { VariantProps } from 'cva'
import type { Ref } from 'react'

type Variants = VariantProps<typeof styles>

type Props = {
  size?: Variants['size']
  icon?: IconComponent
  iconPlacement?: 'left' | 'right'
  label?: string
  hoverable?: boolean
  selected?: boolean
  disabled?: boolean
  onPress?: () => void
}

const Tag = (props: Props, ref: Ref<HTMLDivElement>) => {
  const {
    size = '32',
    icon,
    iconPlacement = 'left',
    label,
    hoverable = false,
    selected = false,
    disabled = false,
    onPress,
    ...tagProps
  } = props

  const iconOnly = Boolean(icon && !label)

  return (
    <div
      //   onPress={onPress}
      //   isDisabled={disabled}
      {...tagProps}
      ref={ref}
      className={styles({ size, selected, disabled, hoverable, iconOnly })}
    >
      {icon && iconPlacement === 'left' && (
        <span className={iconStyles({ size, placement: 'left' })}>
          {cloneElement(icon)}
        </span>
      )}

      {label && <span className="flex-1 whitespace-nowrap">{label}</span>}

      {icon && iconPlacement === 'right' && (
        <span className={iconStyles({ size, placement: 'right' })}>
          {cloneElement(icon)}
        </span>
      )}
    </div>
  )
}

const styles = cva({
  base: [
    'inline-flex shrink-0 items-center justify-center gap-1 border border-neutral-20 font-medium transition-all',
    // "outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2",
    'disabled:cursor-default disabled:opacity-30',
  ],
  variants: {
    size: {
      '32': 'h-8 rounded-20 px-3 text-15',
      '24': 'h-6 rounded-20 px-2 text-13',
    },
    iconOnly: {
      true: 'aspect-square !rounded-full !px-0',
    },
    hoverable: {
      true: 'hover:border-neutral-30',
    },
    selected: {
      true: 'border-customisation-50 bg-customisation-50/10 text-white-100',
    },
    disabled: {
      true: 'cursor-default border-neutral-20 opacity-30',
    },
  },
})

const iconStyles = cva({
  base: 'shrink-0',
  variants: {
    placement: {
      left: '-ml-0.5',
      right: '-mr-0.5',
    },
    size: {
      '32': 'size-5',
      '24': 'size-3',
    },
  },
})

export const TagComponent = forwardRef(Tag)

export { TagComponent as Tag, styles as tagStyles }
export type { Props as TagProps }
