'use client'

import { cloneElement, forwardRef } from 'react'

import { cva } from 'cva'

import { useConfig } from '../provider'

import type { IconElement, Prettify } from '../types'
import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof styles>

type Props = {
  size?: Variants['size']
  variant?: Variants['variant']
  onPress?: () => void
} & (
  | {
      children: React.ReactNode
      iconBefore?: IconElement
      iconAfter?: IconElement
    }
  | {
      icon: IconElement
      'aria-label': string
      children?: never
    }
)

type ButtonProps = Prettify<
  Omit<React.ComponentPropsWithoutRef<'button'>, 'children'> & { href?: never }
>

type LinkProps = Prettify<
  Omit<React.ComponentPropsWithoutRef<'a'>, 'children'> & { href: string }
>

function Button(
  props: Props & (ButtonProps | LinkProps),
  ref: React.Ref<HTMLButtonElement | HTMLAnchorElement>,
) {
  const { size = '40', variant = 'primary' } = props

  const { link } = useConfig()

  const Element = props.href ? link : 'button'

  if ('icon' in props) {
    const { icon: Icon, ...buttonProps } = props
    return (
      <Element
        {...buttonProps}
        ref={ref}
        className={styles({ variant, size, iconOnly: true })}
      >
        {cloneElement(Icon, {
          className: iconStyles({ size, variant }),
        })}
      </Element>
    )
  }

  const { children, iconBefore, iconAfter, ...buttonProps } = props

  return (
    <Element {...buttonProps} ref={ref} className={styles({ variant, size })}>
      {iconBefore && (
        <span className={iconStyles({ size, placement: 'before', variant })}>
          {iconBefore}
        </span>
      )}
      <span className="flex-1 whitespace-nowrap">{children}</span>
      {iconAfter && (
        <span className={iconStyles({ size, placement: 'after', variant })}>
          {iconAfter}
        </span>
      )}
    </Element>
  )
}

const styles = cva({
  base: [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 font-medium transition-all',
    'outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-100',
    'disabled:pointer-events-none disabled:cursor-default disabled:opacity-30',
  ],
  variants: {
    variant: {
      primary: [
        'bg-customisation-50 text-white-100 hover:bg-customisation-60 pressed:bg-customisation-60/90',
        'dark:bg-customisation-60 dark:hover:bg-customisation-50 dark:pressed:bg-customisation-50/90',

        'blured:bg-danger-50 blured:dark:hover:bg-blur-white/70',
        // 'disabled:bg-customisation-50/30',
        // 'blurry:bg-danger-50 dark:blurry:bg-default-customisation-army-50',
      ],
      positive: [
        'bg-success-50 text-white-100 hover:bg-success-60 focus-visible:ring-success-50 disabled:bg-success-50/30',
        'dark:bg-success-60 dark:hover:bg-success-50 dark:pressed:bg-success-50/90',
      ],
      grey: [
        'bg-neutral-10 text-neutral-100 hover:bg-neutral-20 focus-visible:ring-neutral-80 pressed:bg-neutral-30',
        'dark:bg-neutral-80 dark:text-white-100 dark:hover:bg-neutral-60 dark:pressed:bg-neutral-50',
      ],
      darkGrey: [
        'bg-neutral-20 text-neutral-100 hover:bg-neutral-30 focus-visible:ring-neutral-80 pressed:bg-neutral-40',
        'dark:bg-neutral-90 dark:text-white-100 dark:hover:bg-neutral-60 dark:pressed:bg-neutral-50',
      ],
      outline: [
        'border border-neutral-30 text-neutral-100 hover:border-neutral-40 focus-visible:ring-neutral-80 pressed:border-neutral-50',
        'focus-visible:ring-neutral-80 dark:border-neutral-70 dark:text-white-100 dark:hover:border-neutral-60 dark:pressed:border-neutral-50',
      ],
      ghost: [
        'text-neutral-100 hover:bg-neutral-10 pressed:bg-neutral-20',
        'dark:text-white-100 dark:hover:bg-neutral-80 dark:pressed:bg-neutral-70',
      ],
      danger: [
        'bg-danger-50 text-white-100 hover:bg-danger-60 focus-visible:ring-danger-50 pressed:bg-danger-60/90',
        'dark:bg-danger-60 dark:hover:bg-danger-50 dark:pressed:bg-danger-50/90',
      ],
    },
    size: {
      '40': 'h-[40px] rounded-12 px-4 text-15',
      '32': 'h-[32px] rounded-10 px-3 text-15',
      '24': 'h-[24px] rounded-8 px-2 text-13',
    },
    iconOnly: {
      true: 'aspect-square !px-0',
    },
  },
})

const iconStyles = cva({
  base: ['shrink-0', '[&>svg]:size-full'],
  variants: {
    variant: {
      primary: 'text-blur-white/70',
      positive: 'text-blur-white/70',
      grey: 'text-neutral-50',
      darkGrey: 'text-neutral-50',
      outline: 'text-neutral-50',
      ghost: 'text-neutral-50',
      danger: 'text-blur-white/70',
    },
    placement: {
      before: '',
      after: '',
    },
    size: {
      '40': 'size-5',
      '32': 'size-5',
      '24': 'size-3',
    },
  },
  compoundVariants: [
    {
      size: ['40', '32'],
      placement: 'before',
      className: '-ml-1',
    },
    {
      size: ['40', '32'],
      placement: 'after',
      className: '-mr-1',
    },
    {
      size: '24',
      placement: 'before',
      className: '-ml-0.5',
    },
    {
      size: '24',
      placement: 'after',
      className: '-mr-0.5',
    },
  ],
})

const _Button = forwardRef(Button)

export { _Button as Button }
