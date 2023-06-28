import { Fragment } from 'react'

import { Text } from '@status-im/components'
import { ChevronRightIcon } from '@status-im/icons'
import { useRouter } from 'next/router'

import { Link } from './link'

type Props = {
  items: {
    label: string
    href: string
  }[]
  action?: React.ReactElement
}

const Breadcrumbs = (props: Props) => {
  const { items, action = null } = props

  const { asPath } = useRouter()
  const [rawPath] = asPath.split('#')

  return (
    <div className="flex h-[50px] items-center justify-between border-b border-neutral-10 px-5 capitalize">
      <div className="flex items-center gap-1">
        {items.map((item, index) => {
          const divider =
            index > 0 ? (
              <ChevronRightIcon size={20} color="$neutral-50" />
            ) : null
          const active = item.href === rawPath

          if (active) {
            return (
              <Fragment key={item.href + index}>
                {divider}
                <Text
                  key={item.label + index}
                  size={15}
                  color="$neutral-50"
                  weight="medium"
                >
                  {item.label}
                </Text>
              </Fragment>
            )
          }

          return (
            <Fragment key={item.href + index}>
              {divider}
              <Link href={item.href}>
                <Text size={15} color="$neutral-100" weight="medium">
                  {item.label}
                </Text>
              </Link>
            </Fragment>
          )
        })}
      </div>

      {action}
    </div>
  )
}

export { Breadcrumbs }
export type { Props as BreadcrumbsProps }
