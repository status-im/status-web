import { cloneElement, forwardRef } from 'react'

import { cva } from 'cva'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'
import type { Ref } from 'react'

type Variants = VariantProps<typeof styles>

type Props = React.ComponentProps<'button'> & {
  size?: Variants['size']
  label?: string
  icon?: IconElement
  iconPlacement?: 'left' | 'right'
  selected?: boolean
  onPress?: () => void
}

const Tag = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    size = '32',
    icon,
    iconPlacement = 'left',
    label,
    selected = false,
    disabled = false,
    onPress: onClick,
    ...buttonProps
  } = props

  const iconOnly = Boolean(icon && !label)

  return (
    <button
      onClick={onClick}
      {...buttonProps}
      disabled={disabled}
      ref={ref}
      data-selected={selected}
      className={styles({ size, selected, disabled, iconOnly })}
    >
      {icon && iconPlacement === 'left' && (
        <span className={iconStyles({ size, placement: 'left', iconOnly })}>
          {cloneElement(icon)}
        </span>
      )}

      {label && <span className="flex-1 whitespace-nowrap">{label}</span>}

      {icon && iconPlacement === 'right' && (
        <span className={iconStyles({ size, placement: 'right', iconOnly })}>
          {cloneElement(icon)}
        </span>
      )}
    </button>
  )
}

const styles = cva({
  base: [
    'inline-flex shrink-0 items-center justify-center gap-1 border border-neutral-20 font-medium transition-all hover:border-neutral-30',
    'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    'disabled:cursor-default disabled:opacity-30',

    // dark
    'dark:border-neutral-80 dark:text-white-100 dark:hover:border-neutral-60',
  ],
  variants: {
    size: {
      '32': 'h-8 rounded-20 px-3 text-15',
      '24': 'h-6 rounded-20 px-2 text-13',
    },
    selected: {
      true: '!border-customisation-50 bg-customisation-50/10 dark:!border-customisation-60',
    },
    iconOnly: {
      true: 'aspect-square !rounded-full !px-0',
    },
    disabled: {
      true: 'pointer-events-none cursor-default border-neutral-20 opacity-30',
    },
  },
})

const iconStyles = cva({
  base: 'shrink-0 text-neutral-50 dark:text-blur-white/70 [&>svg]:size-full',
  variants: {
    placement: {
      left: '-ml-0.5',
      right: '-mr-0.5',
    },
    iconOnly: {
      true: '!m-0',
    },
    size: {
      '32': 'size-5',
      '24': 'size-3',
    },
  },
})

const _Tag = forwardRef(Tag)

export { _Tag as Tag }
export type { Props as TagProps }
