'use client'

import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TabLink = (
  props: React.ComponentProps<typeof Link> & { href: string }
) => {
  const pathname = usePathname()!
  const isActive = pathname?.startsWith(props.href)

  return (
    <Link
      {...props}
      className={cx(
        'flex items-center rounded-10 bg-neutral-10 px-3 py-1 text-15 font-medium text-neutral-100',
        isActive && 'bg-neutral-50 text-white-100'
      )}
    />
  )
}

export { TabLink }
