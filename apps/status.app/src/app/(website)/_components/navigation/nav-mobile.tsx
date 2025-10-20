'use client'

import { useEffect, useState } from 'react'

import { IconButton } from '@status-im/components'
import { CloseIcon, MenuIcon } from '@status-im/icons/20'
import { usePathname } from 'next/navigation'
import { RemoveScroll } from 'react-remove-scroll'

import { Link } from '~components/link'
import { Logo } from '~components/logo'

import { DownloadDesktopButton } from '../download-desktop-button'
import { AccordionMenu } from './accordion-menu'

const NavMobile = () => {
  const [open, setOpen] = useState(false)
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 0

  const pathname = usePathname()
  useEffect(() => setOpen(false), [pathname])

  return (
    <RemoveScroll
      enabled={open}
      className="z-20 flex flex-col items-center justify-between px-5 py-3 pb-1 [@media(min-width:1150px)]:hidden"
    >
      <div
        className="z-10 flex w-full items-center justify-between"
        data-theme="dark"
      >
        <div className="flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <IconButton
          icon={open ? <CloseIcon /> : <MenuIcon />}
          variant="outline"
          onPress={() => setOpen(prevOpen => !prevOpen)}
        />
      </div>
      <div
        style={{
          height: open ? screenHeight - 100 : 0,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          overflow: 'auto',
        }}
        className="z-10 flex w-full flex-col justify-between bg-blur-neutral-100/70 pt-2 transition-all duration-300"
      >
        <div className="pt-5">
          <AccordionMenu />
        </div>

        <div data-theme="dark" className="flex justify-stretch gap-2 py-3">
          <DownloadDesktopButton size="40" variant="darkGrey" show="all" />
        </div>
      </div>
    </RemoveScroll>
  )
}

export { NavMobile }
