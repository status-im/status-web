import { cva } from 'cva'

import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof styles>

type Props = {
  variant?: Variants['variant']
  value: number
}

const Counter = (props: Props) => {
  const { value, variant = 'default' } = props

  return <div className={styles({ variant })}>{value > 99 ? '99+' : value}</div>
}

export { Counter }
export type { Props as CounterProps }

const styles = cva({
  base: [
    'inline-flex h-4 min-w-4 items-center justify-center whitespace-nowrap rounded-6 px-1 text-11 font-medium leading-none tracking-normal',
  ],
  variants: {
    variant: {
      default: [
        'bg-customisation-50 text-white-100',
        'dark:bg-customisation-60 dark:text-white-100',
      ],
      secondary: [
        'bg-neutral-80/5 text-neutral-100',
        'dark:bg-white-5 dark:text-white-100',
      ],
      grey: [
        'bg-neutral-10 text-neutral-100',
        'dark:bg-neutral-80 dark:text-white-100',
      ],
      outline: [
        'border border-neutral-20 bg-transparent text-neutral-100',
        'dark:border-neutral-80 dark:text-white-80',
      ],
    },
  },
})
