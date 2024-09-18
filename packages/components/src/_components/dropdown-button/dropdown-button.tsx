import { forwardRef } from 'react'

import { DropdownIcon } from '@status-im/icons/20'
import { cva } from 'cva'

import { Button } from '../button'

type ButtonProps = React.ComponentPropsWithoutRef<typeof Button>

type Props = ButtonProps & {
  variant?: Extract<
    ButtonProps['variant'],
    'primary' | 'grey' | 'outline' | 'ghost'
  >
  iconAfter?: never
  children: React.ReactNode
}

const DropdownButton = (props: Props, ref: React.Ref<HTMLButtonElement>) => {
  const { size = '40', variant = 'primary', children, ...buttonProps } = props

  return (
    <Button
      {...buttonProps}
      ref={ref}
      size={size}
      variant={variant}
      iconAfter={<DropdownIcon className={iconStyles({ variant })} />}
    >
      {children}
    </Button>
  )
}

const iconStyles = cva({
  base: [
    'shrink-0 transition-transform duration-200 [[aria-expanded="true"]_&]:rotate-180',
  ],
  variants: {
    variant: {
      primary: ['text-blur-white/70', '[&>path[fill="#E7EAEE"]]:fill-white-20'],
      grey: [
        'text-neutral-100 dark:text-white-100',
        '[&>path[fill="#E7EAEE"]]:dark:fill-neutral-80',
      ],
      outline: [
        'text-neutral-100 dark:text-white-100',
        '[&>path[fill="#E7EAEE"]]:dark:fill-neutral-80',
      ],
      ghost: [
        'text-neutral-100 dark:text-white-100',
        '[&>path[fill="#E7EAEE"]]:dark:fill-neutral-80',
      ],
    },
  },
})

const _DropdownButton = forwardRef(DropdownButton)

export { _DropdownButton as DropdownButton }
export type { Props as DropdownButtonProps }
