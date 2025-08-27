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
  onPress?: (event: React.MouseEvent<HTMLButtonElement>) => void
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
  const { size = '40', variant = 'primary', onPress: onClick, ...rest } = props

  const { link } = useConfig()

  const isExternal =
    typeof props.href === 'string' && props.href.startsWith('http')
  const Element = isExternal ? 'a' : props.href ? link : 'button'

  const linkProps = props.href
    ? {
        href: props.href,
        ...(isExternal && {
          target: '_blank',
          rel: 'noopener noreferrer',
        }),
      }
    : {}

  if ('icon' in rest) {
    const { icon, ...buttonProps } = rest
    return (
      <Element
        onClick={onClick}
        {...buttonProps}
        {...linkProps}
        ref={ref}
        className={styles({ variant, size, iconOnly: true })}
      >
        {cloneElement(icon, {
          className: iconStyles({ size, variant, iconOnly: true }),
        })}
      </Element>
    )
  }

  const { children, iconBefore, iconAfter, ...buttonProps } = rest

  return (
    <Element
      onClick={onClick}
      {...buttonProps}
      {...linkProps}
      ref={ref}
      className={styles({ variant, size })}
    >
      {iconBefore && (
        <span className={iconStyles({ size, placement: 'before', variant })}>
          {iconBefore}
        </span>
      )}
      <span className="whitespace-nowrap">{children}</span>
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
    'inline-flex shrink-0 cursor-pointer select-none items-center justify-center gap-1 text-center font-medium transition-all',
    'outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-neutral-100',
    'disabled:pointer-events-none disabled:cursor-default disabled:opacity-[.3]',
  ],
  variants: {
    variant: {
      primary: [
        'pressed:bg-customisation-60/[.9] bg-customisation-50 text-white-100 hover:bg-customisation-60',
        'dark:pressed:bg-customisation-50/[.9] dark:bg-customisation-60 dark:hover:bg-customisation-50',
      ],
      positive: [
        'bg-success-50 text-white-100 hover:bg-success-60 focus-visible:ring-success-50',
        'dark:bg-success-60 dark:hover:bg-success-50 dark:pressed:bg-success-50/[.9]',
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
        'border border-neutral-30 text-neutral-100 hover:border-neutral-40 focus-visible:ring-neutral-80 pressed:border-neutral-50 disabled:border-neutral-20',
        'blur:border-neutral-80/10 blur:hover:border-neutral-80/20',
        // dark
        'dark:border-neutral-70 dark:text-white-100 dark:hover:border-neutral-60 dark:focus-visible:ring-neutral-80 dark:pressed:border-neutral-50 dark:disabled:border-neutral-80',
        'blur:dark:border-white-10 blur:dark:hover:border-white-20',
      ],
      ghost: [
        'text-neutral-100 hover:bg-neutral-10 pressed:bg-neutral-20',
        'dark:text-white-100 dark:hover:bg-neutral-80 dark:pressed:bg-neutral-70',
      ],
      danger: [
        'bg-danger-50 text-white-100 hover:bg-danger-60 focus-visible:ring-danger-50 pressed:bg-danger-60/[.9]',
        'dark:bg-danger-60 dark:hover:bg-danger-50 dark:pressed:bg-danger-50/[.9]',
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
      primary: ['text-blur-white/70'],
      positive: ['text-blur-white/70'],
      grey: [
        'text-neutral-50',
        'blur:text-neutral-80/40',
        'dark:text-neutral-40',
        'blur:dark:text-white-40',
      ],
      darkGrey: ['text-neutral-40'],
      outline: [
        'text-neutral-50',
        'blur:text-neutral-80/40',
        'dark:text-neutral-40',
        'blur:dark:text-white-40',
      ],
      ghost: ['text-neutral-50'],
      danger: ['text-blur-white/70'],
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
    iconOnly: {
      true: '',
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
    {
      variant: 'grey',
      iconOnly: true,
      className: '!text-neutral-100 dark:!text-white-100',
    },
    {
      variant: 'outline',
      iconOnly: true,
      className: '!text-neutral-100 dark:!text-white-100',
    },
    {
      variant: 'darkGrey',
      iconOnly: true,
      className: '!text-neutral-100 dark:!text-white-100',
    },
    {
      variant: 'ghost',
      iconOnly: true,
      className: '!text-neutral-100 dark:!text-white-100',
    },
    {
      variant: 'primary',
      iconOnly: true,
      className: '!text-white-100',
    },
    {
      variant: 'positive',
      iconOnly: true,
      className: '!text-white-100',
    },
    {
      variant: 'danger',
      iconOnly: true,
      className: '!text-white-100',
    },
  ],
})

const _Button = forwardRef(Button)

export { _Button as Button }
