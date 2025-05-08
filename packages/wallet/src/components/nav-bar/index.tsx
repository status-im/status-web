'use client'

// import { ConnectButton } from '../connect-button'
import { Logo } from '../logo'
import { SettingsPopover } from '../settings-popover'

type Props = {
  pathname: string
}

const Navbar = (props: Props) => {
  const { pathname } = props

  const isRoot = pathname === '-/'

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

      {!isRoot && (
        <div className="flex items-center gap-2 pr-2 xl:pr-6">
          {/* <ConnectButton variant="outline" size="32" label="Connect" /> */}
          <SettingsPopover />
        </div>
      )}
    </div>
  )
}

export { Navbar }
