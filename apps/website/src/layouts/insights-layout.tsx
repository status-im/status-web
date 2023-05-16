import { Text } from '@status-im/components'
import { useRouter } from 'next/router'

import { Link } from '@/components/link'

import { AppLayout } from './app-layout'

import type { PageLayout } from 'next'
import type { LinkProps } from 'next/link'

export const InsightsLayout: PageLayout = page => {
  return AppLayout(
    <div className="bg-white-100 mx-1 grid min-h-[calc(100vh-56px-4px)] grid-cols-[320px_1fr] items-stretch rounded-3xl">
      <aside className="border-neutral-10 flex flex-col gap-3 border-r p-5">
        <NavLink href="/insights">Epics</NavLink>
        <NavLink href="/insights/detail">Detail</NavLink>
        <NavLink href="/insights/orphans">Orphans</NavLink>
        <NavLink href="/insights/repos">Repos</NavLink>
      </aside>
      <main className="p-10">{page}</main>
    </div>
  )
}

const NavLink = (props: LinkProps & { children: string }) => {
  const { children, ...linkProps } = props

  const { asPath } = useRouter()
  const active = asPath === props.href

  return (
    <Link className="transition-opacity hover:opacity-50" {...linkProps}>
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
