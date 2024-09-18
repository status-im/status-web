import { cva } from 'cva'
import * as Aria from 'react-aria-components'

import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof checkStyles>

type Props = Aria.CheckboxProps & {
  variant?: Variants['variant']
}

const Checkbox = (props: Props) => {
  const { variant = 'outline', ...ariaProps } = props

  return (
    <Aria.Checkbox {...ariaProps} className={checkStyles({ variant })}>
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
    </Aria.Checkbox>
  )
}

const checkStyles = cva({
  base: [
    'group inline-flex size-[18px] shrink-0 items-center justify-center overflow-hidden rounded-6 text-white-100 transition-colors',
    'border border-neutral-20 hover:border-neutral-30',
    'selected:border-customisation-50 selected:bg-customisation-50 selected:hover:bg-customisation-60',
    'focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    // dark
    'dark:border-neutral-80 dark:hover:border-neutral-60 dark:selected:hover:bg-customisation-50',
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

export { Checkbox }
export type { Props as CheckboxProps }
