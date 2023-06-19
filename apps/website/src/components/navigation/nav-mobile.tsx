import { useState } from 'react'

import { Button, IconButton } from '@status-im/components'
import { CloseIcon, DownloadIcon, MenuIcon } from '@status-im/icons'

import { Logo } from '@/components/logo'
import { useLockScroll } from '@/hooks/use-lock-scroll'

import { Link } from '../link'
import { AccordionMenu } from './accordion-menu'

const NavMobile = () => {
  const [open, setOpen] = useState(false)
  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 0

  useLockScroll(open)
  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)
  }

  return (
    <div className="md-lg:hidden z-10 flex flex-col items-center justify-between px-5 py-3 pb-1">
      <div className="z-10 flex w-full items-center justify-between">
        <div className="flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <IconButton
          variant="outline"
          icon={
            open ? (
              <CloseIcon size={20} color="$white-100" />
            ) : (
              <MenuIcon size={20} color="$white-100" />
            )
          }
          onPress={handleToggle}
        />
      </div>
      <div
        style={{
          height: open ? screenHeight - 100 : 0,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          overflow: 'auto',
        }}
        className={`bg-blur-neutral-100/70  z-10 flex w-full flex-col justify-between pt-2 transition-all duration-300`}
      >
        <AccordionMenu />
        <div className="flex justify-center py-3">
          <Button
            size={40}
            variant="grey"
            icon={<DownloadIcon size={20} />}
            fullWidth
          >
            Sign up for early access
          </Button>
        </div>
      </div>
    </div>
  )
}

export { NavMobile }
