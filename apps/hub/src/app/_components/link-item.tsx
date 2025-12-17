import { ExternalIcon } from '@status-im/icons/20'
import { Link as StatusLink } from '@status-im/status-network/components'
import { cx } from 'cva'

import { Link, usePathname } from '~/i18n/navigation'

type LinkItemProps = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  tag?: string
  onClick?: () => void
}

const LinkItem = (props: LinkItemProps) => {
  const { id, label, icon: Icon, href, tag } = props
  const pathname = usePathname()

  const isActiveRoute = (href: string) => {
    // usePathname from next-intl already returns pathname without locale prefix
    // href should also be without locale prefix (internal links)
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname === href
  }

  const isExternal = href.startsWith('http')
  const isActive = isActiveRoute(href)

  const handleClick = (e: React.MouseEvent) => {
    if (props.onClick) {
      e.preventDefault()
      props.onClick()
    }
  }

  // Use locale-aware Link for internal links, StatusLink for external
  const LinkComponent = isExternal ? StatusLink : Link

  return (
    <li key={id}>
      <LinkComponent
        href={href}
        onClick={handleClick}
        className={cx(
          'flex items-center justify-between gap-2 rounded-16 p-4 transition-colors',
          isActive
            ? 'bg-customisation-purple-50/5 text-purple'
            : 'text-neutral-90 hover:bg-neutral-10 hover:text-neutral-100'
        )}
        {...(isExternal
          ? { target: '_blank', rel: 'noopener noreferrer' }
          : {})}
      >
        <div className="flex flex-1 items-center justify-between">
          <div className={cx('flex items-center gap-2')}>
            <Icon className="size-5" />
            <span className="text-15 font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            {!!tag && (
              <div className="inline-flex items-center gap-1 rounded-full bg-purple px-1.5 py-0.5">
                <span className="text-11 text-white-100">{tag}</span>
              </div>
            )}
          </div>
        </div>
        {isExternal && <ExternalIcon />}
      </LinkComponent>
    </li>
  )
}

export { LinkItem }
