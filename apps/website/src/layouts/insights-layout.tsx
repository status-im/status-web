import { Button, Text } from '@status-im/components'
import { LockedIcon, StatusIcon } from '@status-im/icons'
import Link from 'next/link'
import { useRouter } from 'next/router'

import type { PageLayout } from 'next'
import type { LinkProps } from 'next/link'

export const InsightsLayout: PageLayout = page => {
  return (
    <>
      <div className="sticky top-0 z-10 grid grid-cols-3 items-center px-4 py-3 backdrop-blur-sm">
        <StatusIcon size={20} />

        <nav className="flex flex-1 justify-center gap-3">
          <NavLink href="/insights">Epics</NavLink>
          <NavLink href="/insights/detail">Detail</NavLink>
          <NavLink href="/insights/orphans">Orphans</NavLink>
          <NavLink href="/insights/repos">Repos</NavLink>
        </nav>

        <div className="flex justify-end">
          <Button size={32} variant="outline" icon={<LockedIcon size={20} />}>
            Log in
          </Button>
        </div>
      </div>

      <div className="px-6 py-4 pb-10">{page}</div>
    </>
  )
}

const NavLink = (props: LinkProps & { children: string }) => {
  const { children, ...linkProps } = props

  const { asPath } = useRouter()
  const active = asPath === props.href

  return (
    <Link
      className={`flex h-8 items-center rounded-[10px] px-3 ${
        active && 'bg-neutral-10 '
      }`}
      {...linkProps}
    >
      <Text size={15} weight="medium">
        {children}
      </Text>
    </Link>
  )
}
