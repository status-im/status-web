import { Text } from '@status-im/components'
import { useRouter } from 'next/router'

import { Link } from '../link'

import type { Url } from 'next/dist/shared/lib/router/router'
import type { LinkProps } from 'next/link'

const NavLink = (
  props: LinkProps & {
    children: string
    handleLinkClick: (href: Url) => void
  }
) => {
  const { children, handleLinkClick, ...linkProps } = props

  const { asPath } = useRouter()
  const active = asPath === props.href

  return (
    <Link
      className="pl-5 transition-opacity hover:opacity-50"
      onClick={() => handleLinkClick(props.href)}
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
