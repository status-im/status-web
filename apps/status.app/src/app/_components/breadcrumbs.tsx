import { Fragment } from 'react'

import { ChevronRightIcon } from '@status-im/icons/20'
import { cva } from 'class-variance-authority'

import { Link } from './link'

type Props = {
  items: Array<{
    label: string
    href: string
  }>
  action?: React.ReactElement
  variant?: 'default' | 'admin'
}

const linkStyles = cva('font-medium text-neutral-100', {
  variants: {
    variant: {
      default: 'text-15',
      admin: 'text-13',
    },
  },
})

const labelStyles = cva('select-none font-medium text-neutral-40', {
  variants: {
    variant: {
      default: 'text-15',
      admin: 'text-13',
    },
  },
})

const containerStyles = cva(
  'flex flex-col-reverse justify-between gap-[13px]',
  {
    variants: {
      variant: {
        default:
          'border-b border-neutral-10 pb-[13px] pt-5 lg:h-[48px] lg:flex-row lg:items-center lg:gap-0 lg:py-0',
        admin: 'py-3 md:h-[48px] md:flex-row md:items-center',
      },
    },
  }
)

const Breadcrumbs = (props: Props) => {
  const { items, action = null, variant = 'default' } = props

  return (
    <div className={containerStyles({ variant })}>
      <div className="flex">
        <div className="flex items-center gap-2 overflow-x-scroll whitespace-nowrap px-5 scrollbar-none">
          {items.map((item, index) => {
            if (index === items.length - 1) {
              return (
                <div
                  key={item.label + index}
                  className={labelStyles({ variant })}
                >
                  {item.label}
                </div>
              )
            }

            return (
              <Fragment key={item.href + index}>
                <Link href={item.href} className={linkStyles({ variant })}>
                  {item.label}
                </Link>
                <ChevronRightIcon className="min-w-[20px] text-neutral-50" />
              </Fragment>
            )
          })}
        </div>
      </div>

      {action && (
        <div className="w-full px-5 md:flex md:justify-end">{action}</div>
      )}
    </div>
  )
}

export { Breadcrumbs }
export type { Props as BreadcrumbsProps }
