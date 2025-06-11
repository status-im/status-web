import { getTabLinkClassName } from '@status-im/wallet/components'
import { Link, useRouterState } from '@tanstack/react-router'

type Props = {
  href: string
  children: React.ReactNode
  className?: string
}

const TabLink = ({ href, children, className }: Props) => {
  const { location } = useRouterState()
  const isActive = location.pathname.startsWith(href)

  return (
    <Link
      to={href}
      className={getTabLinkClassName(isActive, className)}
      viewTransition
    >
      {children}
    </Link>
  )
}

export { TabLink }
