'use client'

import { forwardRef } from 'react'

import * as Checkbox from '@radix-ui/react-checkbox'
import { cva } from 'cva'

import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof styles>

type Props = Omit<Checkbox.CheckboxProps, 'checked' | 'onCheckedChange'> & {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  variant?: Variants['variant']
}

const Root = forwardRef<React.ElementRef<typeof Checkbox.Root>, Props>(
  (props, ref) => {
    const { variant = 'outline', ...checkboxProps } = props

    return (
      <Checkbox.Root
        {...checkboxProps}
        ref={ref}
        className={styles({ variant })}
      >
        <Checkbox.Indicator>
          <svg
            width="10"
            height="9"
            viewBox="0 0 10 9"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="hidden group-aria-checked:block"
            aria-hidden
            focusable="false"
          >
            <path
              d="M1 4.6L3.66667 7L9 1"
              stroke="currentColor"
              strokeWidth="1.5"
            />
          </svg>
        </Checkbox.Indicator>
      </Checkbox.Root>
    )
  },
)

Root.displayName = Checkbox.Root.displayName

const styles = cva({
  base: [
    'group inline-flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-6 text-white-100 transition-colors',
    'border border-neutral-20 hover:border-neutral-30',
    'aria-checked:border-customisation-50 aria-checked:bg-customisation-50 aria-checked:hover:border-customisation-60 aria-checked:hover:bg-customisation-60',
    'focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    // dark
    'dark:border-neutral-80 dark:hover:border-neutral-60 dark:aria-checked:hover:bg-customisation-50',
    'dark:focus-visible:ring-offset-neutral-95',
  ],
  variants: {
    variant: {
      outline: [],
      filled: [
        'bg-neutral-20 hover:bg-neutral-30',
        'dark:bg-neutral-70 dark:hover:bg-neutral-60',
      ],
    },
  },
})

export { Root as Checkbox }
export type { Props as CheckboxProps }
