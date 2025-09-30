'use client'

import { FeedbackPopover } from '../feedback'
import { Logo } from '../logo'

import type { ReactNode } from 'react'

type LinkComponentProps = {
  href: string
  children: ReactNode
}

type Props = {
  hasFeedback?: boolean
  linkComponent?: React.ComponentType<LinkComponentProps>
}

const Navbar = (props: Props) => {
  const { linkComponent: LinkComponent = 'a' } = props

  return (
    <div
      data-theme="dark"
      className="sticky top-0 z-20 flex h-14 flex-1 items-center justify-between bg-neutral-100 pr-1"
    >
      <div className="flex items-center pl-3 lg:pl-6">
        <LinkComponent
          href="/"
          className="flex w-[32px] min-w-[32px] overflow-hidden lg:w-auto"
        >
          <Logo isTopbarDesktop />
        </LinkComponent>
      </div>
      {props.hasFeedback && <FeedbackPopover />}
    </div>
  )
}

export { Navbar }
