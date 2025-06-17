'use client'

import { FeedbackPopover } from '../feedback'
import { Logo } from '../logo'

type Props = {
  pathname: string
}

const Navbar = (props: Props) => {
  const { pathname } = props

  const isRoot = pathname === '-/'

  return (
    <div
      data-theme="dark"
      className="sticky top-0 z-20 flex h-14 flex-1 items-center justify-between bg-neutral-100 pr-1"
    >
      <div className="flex items-center pl-3 lg:pl-6">
        <a
          href="/"
          className="flex w-[32px] min-w-[32px] overflow-hidden lg:w-auto"
        >
          <Logo isTopbarDesktop />
        </a>
      </div>
      {!isRoot && <FeedbackPopover />}
    </div>
  )
}

export { Navbar }
