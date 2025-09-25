'use client'

import { Navbar as NavbarBase } from '@status-im/wallet/components'
import { usePathname } from 'next/navigation'

import { ConnectButton } from './connect-button'

const Navbar = () => {
  const pathName = usePathname()
  const isRoot = pathName === '/'

  return (
    <NavbarBase rightSlot={isRoot ? undefined : <ConnectButton size="32" />} />
  )
}

export { Navbar }
