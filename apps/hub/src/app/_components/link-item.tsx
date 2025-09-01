import { ExternalIcon } from '@status-im/icons/20'
import { usePathname } from 'next/navigation'

import { Link } from './link'

type LinkItemProps = {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  tag?: string
}

const LinkItem = (props: LinkItemProps) => {
  const pathname = usePathname()

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname === href
  }

  const isExternal = props.href.startsWith('http')
  const isActive = isActiveRoute(props.href)

  return (
    <li key={props.id}>
      <Link
        href={props.href}
        className={`flex items-center justify-between gap-2 rounded-16 p-4 transition-colors ${
          isActive
            ? 'bg-customisation-purple-50/5 text-purple'
            : 'text-neutral-90 hover:bg-neutral-10 hover:text-neutral-100'
        }`}
      >
        <div className="flex items-center gap-2">
          <props.icon className="size-5" />
          <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
            {props.label}
          </span>
          {!!props.tag && (
            <div className="inline-flex items-center gap-1 rounded-full bg-purple px-1.5 py-0.5">
              <span className="text-11 font-medium leading-[1.42] tracking-[-0.5%] text-white-100">
                {props.tag}
              </span>
            </div>
          )}
        </div>
        {isExternal && <ExternalIcon />}
      </Link>
    </li>
  )
}

export { LinkItem }
