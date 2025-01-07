import { cloneElement, forwardRef } from 'react'

import { match, P } from 'ts-pattern'

import { cva } from '../utils/variants'

import type { IconElement } from '../types'
import type { VariantProps } from '../utils/variants'

const styles = cva({
  base: 'grid size-4 flex-shrink-0 place-items-center rounded-6 border',
  variants: {
    variant: {
      primary: [
        'border-customisation-60 bg-customisation-50 text-white-100',
        'dark:border-customisation-50 dark:bg-customisation-60 dark:text-white-100',
      ],
      secondary: [
        'border-neutral-20 bg-neutral-10 text-neutral-50',
        'dark:border-neutral-70 dark:bg-neutral-90 dark:text-neutral-40',
      ],
      gray: [
        'border-neutral-10 text-neutral-50',
        'dark:border-neutral-80 dark:text-neutral-40',
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

type Props = VariantProps<typeof styles> &
  (
    | {
        icon: IconElement
        symbol?: never
      }
    | {
        symbol: string
        icon?: never
      }
  )

const Shortcut = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { variant = 'primary' } = props

  return (
    <div className={styles({ variant })} ref={ref}>
      {match(props)
        .with({ symbol: P.string }, ({ symbol }) => (
          <span className="text-11 font-medium">{symbol}</span>
        ))
        .with({ icon: P._ }, ({ icon }) =>
          cloneElement(icon, { className: 'size-3' }),
        )
        .exhaustive()}
    </div>
  )
}

const _Shortcut = forwardRef(Shortcut)

export { _Shortcut as Shortcut }
export type { Props as ShortcutProps }
