'use client'

import { CloseIcon, MenuIcon } from '@status-im/icons/20'
import { BRAND, LEGAL, ROUTES, SOCIALS } from '~/config/routes'
import { Button } from '~components/button'
import { cx } from 'cva'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { ButtonLink } from './button-link'
import { Divider } from './divider'

const NavBarMobile = () => {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const scrollPositionRef = useRef(0)

  useLayoutEffect(() => {
    if (isOpen) {
      scrollPositionRef.current = window.scrollY
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
      window.scrollTo({
        top: scrollPositionRef.current,
        behavior: 'instant',
      })
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      setIsOpen(false)
      scrollPositionRef.current = 0
      window.scrollTo({
        top: 0,
        behavior: 'instant',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <header>
      <motion.nav
        key="nav-bar-mobile"
        className={cx([
          'fixed left-0 top-0 z-[100] block w-screen border-x border-neutral-20 backdrop-blur transition-all supports-[backdrop-filter]:bg-white-80 lg:hidden',
        ])}
        animate={{
          height: isOpen ? '100dvh' : '56px',

          backgroundColor: isOpen
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(255, 255, 255, 0.9)',
        }}
        initial={{
          height: '56px',
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
      >
        <motion.div
          className="fixed left-[7px] h-dvh w-px bg-neutral-20"
          animate={{
            height: isOpen ? '100dvh' : '56px',
          }}
          initial={{
            height: '56px',
          }}
        />
        <motion.div
          className="fixed right-[7px] h-dvh w-px bg-neutral-20"
          animate={{
            height: isOpen ? '100dvh' : '56px',
          }}
          initial={{
            height: '56px',
          }}
        />

        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/logo.svg"
              alt="Status Network Logo"
              width={210}
              height={32}
            />
          </Link>
          <Button
            variant="white"
            size="32"
            onClick={() => setIsOpen(!isOpen)}
            className="px-[5px]"
          >
            {isOpen ? <CloseIcon /> : <MenuIcon />}
          </Button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              key="menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'calc(100% - 80px)' }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              className="fixed inset-x-0 top-20 z-30 overflow-hidden"
            >
              <motion.div
                key="menu-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                exit={{
                  opacity: 0,
                  transition: {
                    duration: 0.3,
                    delay: 0,
                  },
                }}
                className="flex h-[calc(100dvh-81px)] flex-col items-center"
              >
                <ul className="flex h-[calc(100dvh-204px)] flex-col justify-center gap-6">
                  {ROUTES.Navigation.map((item, index) => (
                    <motion.li
                      key={item.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
                      className="text-center text-40 font-600"
                    >
                      <Link href={item.href} onClick={() => setIsOpen(false)}>
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
                <motion.div
                  key="menu-buttons"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + 4 * 0.05, duration: 0.3 }}
                  className="grid w-full grid-cols-2 gap-3 p-4"
                >
                  <ButtonLink
                    variant="white"
                    className="w-full justify-center"
                    href={ROUTES.Docs}
                    onClick={() => setIsOpen(false)}
                  >
                    Read docs
                  </ButtonLink>
                  <ButtonLink
                    className="w-full justify-center"
                    href={ROUTES.Bridge}
                    onClick={() => setIsOpen(false)}
                  >
                    Get started
                  </ButtonLink>
                </motion.div>
                <div className="z-40 ml-0 w-[calc(100vw-18px)]">
                  <Divider />
                </div>
                <motion.div
                  key="menu-footer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + 4 * 0.05, duration: 0.3 }}
                  className="flex w-full justify-between gap-3 p-4"
                >
                  <div className="flex items-center justify-center gap-4">
                    <Link
                      href={LEGAL.termsOfUse.href}
                      className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
                    >
                      {LEGAL.termsOfUse.name}
                    </Link>

                    <Link
                      href={LEGAL.privacyPolicy.href}
                      className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
                    >
                      {LEGAL.privacyPolicy.name}
                    </Link>

                    <Link
                      href={BRAND.href}
                      className="text-13 text-neutral-50 transition-colors hover:text-neutral-100"
                    >
                      {BRAND.name}
                    </Link>
                  </div>

                  <div className="flex justify-center gap-3">
                    {Object.values(SOCIALS).map(social => {
                      return (
                        <Link
                          href={social.href}
                          key={social.name}
                          className="transition-opacity hover:opacity-[60%]"
                        >
                          <Image
                            src={social.src}
                            alt={social.name}
                            width={20}
                            height={20}
                          />
                        </Link>
                      )
                    })}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="ml-2 w-[calc(100vw-18px)]">
          <Divider />
        </div>
      </motion.nav>
    </header>
  )
}

export { NavBarMobile }
