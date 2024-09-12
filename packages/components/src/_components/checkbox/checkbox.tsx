import { cva } from 'cva'
import { Checkbox as AriaCheckbox } from 'react-aria-components'

import type { Aria } from '../types'
import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof checkStyles>

type Props = Aria.CheckboxProps & {
  children?: React.ReactNode
  variant?: Variants['variant']
}

const Checkbox = (props: Props) => {
  const { children = null, variant = 'outline', ...ariaProps } = props

  return (
    <AriaCheckbox {...ariaProps} className="group flex items-center gap-2">
      <div className={checkStyles({ variant })}>
        <svg
          width="10"
          height="9"
          viewBox="0 0 10 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hidden group-selected:block"
          aria-hidden
          focusable="false"
        >
          <path
            d="M1 4.6L3.66667 7L9 1"
            stroke="currentColor"
            strokeWidth="1.5"
          />
        </svg>
      </div>
      <span className="text-13">{children}</span>
    </AriaCheckbox>
  )
}

const checkStyles = cva({
  base: [
    'inline-flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-6 text-white-100 transition-colors',
    'border border-neutral-20 group-hover:border-neutral-30',
    'group-selected:border-customisation-50 group-selected:bg-customisation-50 group-selected:group-hover:bg-customisation-60',

    'dark:border-neutral-80 dark:group-hover:border-neutral-60 dark:group-selected:group-hover:bg-customisation-50',
  ],
  variants: {
    variant: {
      outline: [],
      filled: [
        'bg-neutral-20 group-hover:bg-neutral-30',
        'dark:bg-neutral-70 dark:group-hover:bg-neutral-60',
      ],
    },
  },
})

export { Checkbox }
export type { Props as CheckboxProps }
