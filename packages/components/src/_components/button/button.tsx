import { cloneElement, forwardRef } from 'react'

import { cva } from 'cva'
import { Button as AriaButton, Link as AriaLink } from 'react-aria-components'

import type { IconComponent } from '../types'
import type { VariantProps } from 'cva'
import type { Ref } from 'react'
import type { ButtonProps as AriaButtonProps } from 'react-aria-components'

type Variants = VariantProps<typeof styles>

type Props = {
  size?: Variants['size']
  variant?: Variants['variant']
  onClick?: () => void
  onPress?: AriaButtonProps['onPress']
  disabled?: boolean
  // isDisabled?: boolean
} & (
  | {
      children: React.ReactNode
      iconBefore?: IconComponent
      iconAfter?: IconComponent
    }
  | {
      icon: IconComponent
      ariaLabel: string
    }
)

const Button = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    size = '40',
    variant = 'primary',
    onClick: onPress,
    ...buttonProps
  } = props

  // icon only
  if ('icon' in props) {
    const { icon: Icon } = props
    return (
      <AriaButton
        onPress={onPress}
        {...buttonProps}
        ref={ref}
        className={styles({ variant, size, iconOnly: true })}
      >
        {cloneElement(Icon, {
          className: iconStyles({ size, variant }),
        })}
      </AriaButton>
    )
  }

  const { children, iconBefore, iconAfter } = props

  return (
    <AriaButton
      onPress={onPress}
      {...buttonProps}
      ref={ref}
      className={styles({ variant, size })}
    >
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
    </AriaButton>
  )
}

const styles = cva({
  base: [
    'inline-flex shrink-0 cursor-pointer items-center justify-center gap-1 font-medium transition-all',
    'outline-none focus:outline-none focus-visible:ring-2 focus-visible:ring-customisation-50 focus-visible:ring-offset-2',
    'disabled:cursor-default disabled:opacity-30',
    // 'flex cursor-pointer items-center gap-3 px-4 py-[10px] text-13 text-white-100 transition-all',
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
      ],
      grey: [
        'bg-neutral-10 text-neutral-100 hover:bg-neutral-20 focus-visible:ring-neutral-80 pressed:bg-neutral-30',
      ],
      darkGrey: [
        'bg-neutral-20 text-neutral-100 hover:bg-neutral-30 focus-visible:ring-neutral-80 pressed:bg-neutral-40',
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
        'bg-danger-50 text-white-100 hover:bg-danger-60 focus-visible:ring-danger-50',
        'dark:bg-danger-60 dark:hover:bg-danger-50',
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
  base: 'shrink-0',
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

export { _Button as Button, styles as buttonStyles }
export type { Props as ButtonProps }
