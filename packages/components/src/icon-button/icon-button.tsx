'use client'

import { forwardRef } from 'react'

import { cva } from 'cva'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'
import type { Ref } from 'react'

type Variants = VariantProps<typeof styles>

type Props = {
  variant?: Variants['variant']
  icon: IconElement
  onPress?: () => void
}

type ButtonProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'children'>

const IconButton = (
  props: Props & ButtonProps,
  ref: Ref<HTMLButtonElement>,
) => {
  const { variant = 'default', onPress: onClick, icon, ...buttonProps } = props

  return (
    <button
      {...buttonProps}
      onClick={onClick}
      ref={ref}
      className={styles({ variant })}
    >
      {icon}
    </button>
  )
}

const styles = cva({
  base: [
    'inline-flex size-8 cursor-pointer items-center justify-center rounded-10 border transition-all',
    'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    'disabled:cursor-default disabled:opacity-[.3]',
  ],

  variants: {
    variant: {
      default: [
        'border-transparent bg-neutral-10 text-neutral-50 active:border-neutral-20 active:bg-neutral-10 active:text-neutral-100 hover:bg-neutral-20',
        'dark:bg-neutral-90 dark:text-neutral-40 dark:active:border-neutral-60 dark:active:bg-neutral-80/70 dark:active:text-white-100 dark:hover:bg-neutral-80',
      ],
      outline: [
        'border-neutral-30 text-neutral-50 active:border-neutral-20 active:bg-neutral-10 active:text-neutral-100 hover:border-neutral-40',
        'dark:border-neutral-70 dark:text-neutral-40 dark:active:border-neutral-60 dark:active:bg-neutral-80/70 dark:active:text-white-100 dark:hover:bg-neutral-60',
      ],
      ghost: [
        'border-transparent text-neutral-50 active:border-neutral-20 active:bg-neutral-10 active:text-neutral-100 hover:bg-neutral-10',
        'dark:text-neutral-40 dark:active:border-neutral-60 dark:active:bg-neutral-80/70 dark:active:text-white-100 dark:hover:bg-neutral-80/70',
      ],
    },
  },
})

const _IconButton = forwardRef(IconButton)

export { _IconButton as IconButton }
export type { Props as IconButtonProps }
