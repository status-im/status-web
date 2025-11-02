import { ExternalIcon } from '@status-im/icons/20'
import { Link } from '@status-im/status-network/components'
import { cx } from 'cva'
import { usePathname } from 'next/navigation'

type LinkItemProps = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  tag?: string
  soon?: boolean
}

const LinkItem = (props: LinkItemProps) => {
  const { id, label, icon: Icon, href, tag, soon } = props
  const pathname = usePathname()

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname === href
  }

  const isExternal = href.startsWith('http')
  const isActive = isActiveRoute(href)

  return (
    <li key={id}>
      <Link
        href={soon ? '#' : href}
        className={cx(
          'flex items-center justify-between gap-2 rounded-16 p-4 transition-colors',
          isActive
            ? 'bg-customisation-purple-50/5 text-purple'
            : 'text-neutral-90 hover:bg-neutral-10 hover:text-neutral-100',
          soon && 'pointer-events-none'
        )}
        aria-disabled={soon}
      >
        <div className="flex flex-1 items-center justify-between">
          <div
            className={cx('flex items-center gap-2', soon && 'opacity-[0.5]')}
          >
            <Icon className="size-5" />
            <span className="text-15 font-medium">{label}</span>
          </div>
          <div className="flex items-center gap-1">
            {!!tag && (
              <div className="inline-flex items-center gap-1 rounded-full bg-purple px-1.5 py-0.5">
                <span className="text-11 text-white-100">{tag}</span>
              </div>
            )}
            {soon && (
              <div className="inline-flex items-center gap-1 rounded-full bg-neutral-80/5 px-1.5 py-0.5">
                <span className="text-11 text-neutral-100">Soon</span>
              </div>
            )}
          </div>
        </div>
        {isExternal && !soon && <ExternalIcon />}
      </Link>
    </li>
  )
}

export { LinkItem }
