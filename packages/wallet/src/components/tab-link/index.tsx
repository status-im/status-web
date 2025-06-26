import { cx } from 'class-variance-authority'

import type { ComponentType, ReactNode } from 'react'

export function getTabLinkClassName(isActive?: boolean, className?: string) {
  return cx(
    'flex items-center rounded-10 bg-neutral-10 px-3 py-1 text-15 font-medium text-neutral-100',
    isActive && 'bg-neutral-50 text-white-100',
    className,
  )
}

type LinkComponentProps = {
  href: string
  className?: string
  children: ReactNode
}

type Props = {
  href: string
  children: ReactNode
  className?: string
  isActive?: boolean
  LinkComponent: ComponentType<LinkComponentProps>
}

const TabLink = ({
  href,
  children,
  className,
  LinkComponent,
  isActive,
}: Props) => {
  return (
    <LinkComponent
      href={href}
      className={cx(
        'flex items-center rounded-10 bg-neutral-10 px-3 py-1 text-15 font-medium text-neutral-100',
        isActive && 'bg-neutral-50 text-white-100',
        className,
      )}
    >
      {children}
    </LinkComponent>
  )
}

export { TabLink }
