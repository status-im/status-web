import { cva } from 'cva'

import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof styles>

type Props = {
  value: number
  size?: 18 | 22
  variant?: Variants['variant']
}

const Step = (props: Props) => {
  const { size = 18, value, variant = 'outline' } = props

  return <span className={styles({ variant, size })}>{value}</span>
}

const styles = cva({
  base: [
    'inline-flex w-fit basis-[fit-content] items-center justify-center rounded-6 border text-11 font-medium',
    'min-w-[20px] max-w-[28px] px-[3px] py-0',
  ],
  variants: {
    variant: {
      outline: 'border-neutral-20 bg-transparent text-neutral-100',
      primary: 'border-transparent bg-customisation-50 text-white-100',
      secondary: 'border-transparent bg-customisation-50/10 text-neutral-100',
    },
    size: {
      18: [
        'min-w-[20px] max-w-[28px] py-px',
        'h-[18px] min-w-[18px] max-w-[28px]',
      ],
      22: ['min-w-[24px] max-w-[32px]', 'h-[22px] min-w-[22px] max-w-[32px]'],
    },
  },
})

export { Step }
export type { Props as StepProps }
