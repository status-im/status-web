import { cloneElement, forwardRef } from 'react'

import { cva, cx } from 'cva'
import { match } from 'ts-pattern'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof baseStyles>

type Props = {
  size?: Variants['size']
} & (
  | { type: 'label'; children: string }
  | { type: 'community'; label: string; icon: IconElement }
  | { type: 'token'; label: string; icon: IconElement }
  | { type: 'network'; label: string; icon: IconElement }
  | { type: 'icon'; label: string; icon: IconElement }
)
// | { type: 'user'; user: { name: string; src: string } }
// | { type: 'account'; account: { name: string; emoji: string } }
// | {
//     type: 'group'
//     group: {
//       name: string
//       icon: React.ReactElement
//     }
//   }
// | {
//     type: 'channel'
//     channel: { communityName: string; src: string; name: string }
//   }
// | { type: 'collectible'; collectible: { name: string; src: string } }
// | { type: 'address'; address: string }
// | { type: 'audio'; audioLength: string }

const baseStyles = cva({
  base: [
    'inline-flex w-fit cursor-default items-center rounded-full',
    'font-medium text-neutral-100 dark:text-white-100',
    'bg-neutral-10 blur:bg-neutral-80/5 dark:bg-neutral-90 blur:dark:bg-white-5',
  ],
  variants: {
    size: {
      '32': 'h-8 gap-2 px-3 text-15',
      '24+': 'h-6 gap-1 px-2 text-15',
      '24': 'h-6 gap-1 px-2 text-13',
      '20': 'h-5 gap-1 px-1.5 text-13',
    },
    selected: {
      true: 'border border-customisation-50',
    },
  },
})

const iconStyles = cva({
  base: 'shrink-0 [&>*]:size-full',
  variants: {
    size: {
      '32': 'size-7',
      '24+': 'size-5',
      '24': 'size-5',
      '20': 'size-4',
    },
    offset: {
      '32': '-ml-2.5',
      '24+': '-ml-1.5',
      '24': '-ml-1.5',
      '20': '-ml-1',
    },
    rounded: {
      '6': 'overflow-hidden rounded-6',
      true: 'overflow-hidden rounded-full',
    },
  },
})

const ContextTag = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { size = '24', ...rest } = props

  return match(props)
    .with({ type: 'label' }, ({ children }) => {
      return (
        <div {...rest} ref={ref} className={baseStyles({ size })}>
          <span>{children}</span>
        </div>
      )
    })
    .with({ type: 'community' }, ({ icon, label }) => {
      return (
        <div {...rest} ref={ref} className={baseStyles({ size })}>
          <span className={iconStyles({ size, rounded: true, offset: size })}>
            {cloneElement(icon)}
          </span>
          <span>{label}</span>
        </div>
      )
    })
    .with({ type: 'token' }, ({ icon, label }) => {
      return (
        <div {...rest} ref={ref} className={baseStyles({ size })}>
          <span className={iconStyles({ size, rounded: true, offset: size })}>
            {cloneElement(icon)}
          </span>
          <span>{label}</span>
        </div>
      )
    })
    .with({ type: 'network' }, ({ icon, label }) => {
      return (
        <div {...rest} ref={ref} className={baseStyles({ size })}>
          <span className={iconStyles({ size, rounded: true, offset: size })}>
            {cloneElement(icon)}
          </span>
          <span>{label}</span>
        </div>
      )
    })
    .with({ type: 'icon' }, ({ icon, label }) => {
      return (
        <div {...rest} ref={ref} className={baseStyles({ size })}>
          <span
            className={cx(
              iconStyles({
                size,
                className: 'text-neutral-50',
              }),
            )}
          >
            {cloneElement(icon)}
          </span>
          <span>{label}</span>
        </div>
      )
    })
    .exhaustive()
}

const _ContextTag = forwardRef(ContextTag)

export { _ContextTag as ContextTag }
export type { Props as ContextTagProps }
