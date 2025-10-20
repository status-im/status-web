import { cva, cx } from 'cva'
import { forwardRef } from 'react'

type Props = {
  variant?: 'primary' | 'secondary' | 'white'
  backdropFilter?: boolean
  children?: React.ReactNode
  active?: boolean
  icon?: React.ReactNode
  iconBefore?: React.ReactNode
  size?: '32' | '40'
} & React.ComponentProps<'button'>

const buttonStyles = cva({
  base: 'inline-flex font-500 cursor-pointer gap-1 select-none text-15 items-center  border transition-all w-fit disabled:opacity-[0.3] disabled:cursor-default whitespace-nowrap',
  variants: {
    variant: {
      primary:
        'bg-purple border-[transparent] hover:bg-purple-dark text-white-100',
      secondary:
        'bg-white-5 border-white-10 hover:bg-white-10 hover:border-white-20 text-white-100',
      white:
        'bg-white-100 border-neutral-30 hover:border-neutral-40 hover:bg-white-80 text-dark-100',
    },
    withIcon: {
      true: '',
      false: '',
    },
    withIconBefore: {
      true: '',
      false: '',
    },
    size: {
      '32': 'h-8 py-[5px] rounded-10',
      '40': 'h-10 py-[9px] rounded-12',
    },
    backdropFilter: {
      true: 'backdrop-blur-[20px]',
      false: '',
    },
    active: {
      true: '',
      false: '',
    },
  },
  compoundVariants: [
    { size: '40', withIcon: false, className: 'px-4' },
    { size: '32', withIcon: false, className: 'px-3' },
    { size: '40', withIcon: true, className: 'pl-4 pr-3' },
    { size: '32', withIcon: true, className: 'pl-3 pr-2' },
    { size: '40', withIconBefore: true, className: 'pl-3 pr-4' },
    { size: '32', withIconBefore: true, className: 'pl-2 pr-3' },
  ],
})

const Button = forwardRef<HTMLButtonElement, Props>((props, ref) => {
  const {
    variant = 'primary',
    className,
    active,
    icon,
    iconBefore,
    backdropFilter,
    size = '40',
    children,
    ...rest
  } = props
  return (
    <button
      ref={ref}
      className={cx([
        buttonStyles({
          variant,
          active,
          withIcon: !!icon,
          withIconBefore: !!iconBefore,
          backdropFilter,
          size,
        }),
        className,
      ])}
      {...rest}
    >
      {iconBefore}
      {children}
      {icon}
    </button>
  )
})

Button.displayName = 'Button'

export { Button }
