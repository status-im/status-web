'use client'

import { Text } from '@status-im/components'
import { usePathname } from 'next/navigation'

import { Link } from '~components/link'

import type { LinkProps } from 'next/link'

const NavLink = (
  props: LinkProps & {
    children: string
  }
) => {
  const { children, ...linkProps } = props

  const pathname = usePathname()!
  const active = pathname === props.href

  return (
    <Link
      className="pl-5 transition-opacity hover:opacity-[50%]"
      {...linkProps}
    >
      <Text
        size={19}
        weight="medium"
        color={active ? '$neutral-50' : '$neutral-100'}
      >
        {children}
      </Text>
    </Link>
  )
}

export { NavLink }
