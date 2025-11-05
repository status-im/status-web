import { cva, cx } from 'cva'

import { Link } from '../link'

type Props = {
  variant?: 'primary' | 'secondary' | 'white' | 'outline' | 'danger' | 'grey'
  backdropFilter?: boolean
  children?: React.ReactNode
  active?: boolean
  icon?: React.ReactNode
  iconBefore?: React.ReactNode
  size?: '24' | '32' | '40'
} & React.ComponentProps<typeof Link>

const buttonStyles = cva({
  base: 'inline-flex w-fit cursor-pointer select-none items-center gap-1 border font-500 transition-all disabled:cursor-default disabled:opacity-[0.3]',
  variants: {
    variant: {
      primary:
        'border-[transparent] bg-purple text-white-100 hover:bg-purple-dark',
      secondary:
        'border-white-10 bg-white-5 text-white-100 hover:border-white-20 hover:bg-white-10',
      white:
        'border-neutral-30 bg-white-100 text-dark-100 hover:border-neutral-40 hover:bg-white-80',
      outline: [
        'border-neutral-30 text-neutral-100 hover:border-neutral-40 disabled:border-neutral-20',
      ],
      danger:
        'border-[transparent] bg-danger-50 text-white-100 hover:bg-danger-60',
      grey: 'bg-neutral-10 text-neutral-100 hover:bg-neutral-20 hover:text-neutral-100',
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
      '24': 'h-6 rounded-8 px-2 py-[3px] text-13',
      '32': 'h-8 rounded-10 py-[5px] text-15',
      '40': 'h-10 rounded-12 py-[9px] text-15',
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
    { size: '24', withIcon: false, className: 'px-2' },
    { size: '24', withIcon: true, className: 'pl-2 pr-[6px]' },
    { size: '40', withIcon: true, className: 'pl-4 pr-3' },
    { size: '32', withIcon: true, className: 'pl-3 pr-2' },
    { size: '40', withIconBefore: true, className: 'pl-3 pr-4' },
    { size: '32', withIconBefore: true, className: 'pl-2 pr-3' },
    { size: '24', withIconBefore: true, className: 'pl-[6px] pr-2' },
    {
      variant: 'grey',
      active: true,
      className: 'bg-neutral-50 text-white-100',
    },
  ],
})

const ButtonLink = (props: Props) => {
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

  const external = typeof rest.href === 'string' && rest.href.includes('http')

  return (
    <Link
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
      {...(external && {
        target: '_blank',
        rel: 'noopener noreferrer',
      })}
      {...rest}
    >
      {iconBefore}
      {children}
      {icon}
    </Link>
  )
}

export { ButtonLink }
