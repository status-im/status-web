import { forwardRef } from 'react'

import { cva } from 'cva'
import { Button as AriaButton } from 'react-aria-components'

import type { IconComponentType } from '../types'
import type { VariantProps } from 'cva'
import type { Ref } from 'react'
import type { ButtonProps as AriaButtonProps } from 'react-aria-components'

type Variants = VariantProps<typeof styles>

type Props = AriaButtonProps & {
  variant?: Variants['variant']
  icon: IconComponentType
}

const IconButton = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { variant = 'default', icon: Icon, ...buttonProps } = props

  return (
    <AriaButton {...buttonProps} ref={ref} className={styles({ variant })}>
      <Icon />
    </AriaButton>
  )
}

const styles = cva({
  base: [
    'inline-flex size-8 cursor-pointer items-center justify-center rounded-5 border transition-all',
    'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    'disabled:cursor-default disabled:opacity-30',
  ],

  variants: {
    variant: {
      default: [
        'border-transparent bg-neutral-10 text-neutral-50 hover:bg-neutral-20 pressed:border-neutral-20 pressed:bg-neutral-10 pressed:text-neutral-100',
        'dark:bg-neutral-90 dark:text-neutral-40 dark:hover:bg-neutral-80 dark:pressed:border-neutral-60 dark:pressed:bg-neutral-80/70 dark:pressed:text-white-100',
      ],
      outline: [
        'border-neutral-30 text-neutral-50 hover:border-neutral-40 pressed:border-neutral-20 pressed:bg-neutral-10 pressed:text-neutral-100',
        'dark:border-neutral-70 dark:text-neutral-40 dark:hover:bg-neutral-60 dark:pressed:border-neutral-60 dark:pressed:bg-neutral-80/70 dark:pressed:text-white-100',
      ],
      ghost: [
        'border-transparent text-neutral-50 hover:bg-neutral-10 pressed:border-neutral-20 pressed:bg-neutral-10 pressed:text-neutral-100',
        'dark:text-neutral-40 dark:hover:bg-neutral-80/70 dark:pressed:border-neutral-60 dark:pressed:bg-neutral-80/70 dark:pressed:text-white-100',
      ],
    },
  },
})

const _IconButton = forwardRef(IconButton)

export { _IconButton as IconButton }
export type { Props as IconButtonProps }
