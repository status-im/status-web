'use client'

// import { ConnectButton } from '../connect-button'
import { Logo } from '../logo'

const Navbar = () => {
  return (
    <div
      data-theme="dark"
      className="sticky top-0 z-20 flex h-14 flex-1 items-center justify-between bg-neutral-100"
    >
      <div className="flex items-center pl-3 lg:pl-6">
        <a
          href="/"
          className="flex w-[32px] min-w-[32px] overflow-hidden lg:w-auto"
        >
          <Logo isTopbarDesktop />
        </a>
      </div>
    </div>
  )
}

export { Navbar }
