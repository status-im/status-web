'use client'

import { Navbar as NavbarBase } from '@status-im/wallet/components'
import { usePathname } from 'next/navigation'

const Navbar = () => {
  const pathname = usePathname()

  return <NavbarBase pathname={pathname} />
}

export { Navbar }
