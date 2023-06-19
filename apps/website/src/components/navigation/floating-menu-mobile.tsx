import { useEffect, useRef, useState } from 'react'

import { Button, IconButton } from '@status-im/components'
import { CloseIcon, DownloadIcon, MenuIcon } from '@status-im/icons'
import { cx } from 'class-variance-authority'

import { useLockScroll } from '@/hooks/use-lock-scroll'
import { useOutsideClick } from '@/hooks/use-outside-click'

import { Link } from '../link'
import { Logo } from '../logo'
import { AccordionMenu } from './accordion-menu'

const FloatingMenuMobile = () => {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(open)
  openRef.current = open

  // Using ref to prevent re-running of useEffect
  const visibleRef = useRef(visible)
  const scrollYRef = useRef(0)
  visibleRef.current = visible

  // Close menu on outside click
  const ref = useOutsideClick(() => setOpen(false))
  useLockScroll(open)

  useEffect(() => {
    const handleScroll = () => {
      const isMenuOpen = openRef.current
      const isScrollingUp = window.scrollY < scrollYRef.current
      const detectionPoint = window.scrollY > 60

      if (detectionPoint && isScrollingUp) {
        if (!visibleRef.current) {
          setVisible(true)
        }
      } else {
        if (!isMenuOpen) {
          setVisible(false)
        }
      }
      scrollYRef.current = window.scrollY
    }

    const isDesktop = window.innerWidth > 768

    if (isDesktop) return
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <>
      {visible && (
        <div
          ref={ref}
          className={cx([
            'fixed left-1/2 top-1 z-10 flex -translate-x-1/2 flex-col items-center justify-between p-2 pb-0 lg:hidden',
            'bg-blur-neutral-80/80 border-neutral-80/5 rounded-2xl border backdrop-blur-md',
            ' w-[calc(100%-24px)]',
          ])}
        >
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
                  <CloseIcon size={20} color={'$white-100'} />
                ) : (
                  <MenuIcon size={20} />
                )
              }
              onPress={() => setOpen(!open)}
            />
          </div>
          <div
            style={{
              height: open ? '100%' : 0,
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              overflow: open ? 'auto' : 'hidden',
            }}
            className={`z-10 flex w-full flex-col justify-between pt-2`}
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
      )}
    </>
  )
}

export { FloatingMenuMobile }
