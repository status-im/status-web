import { useEffect, useRef, useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { Button, IconButton, Text } from '@status-im/components'
import {
  ChevronRightIcon,
  CloseIcon,
  DownloadIcon,
  ExternalIcon,
  MenuIcon,
} from '@status-im/icons'
import { cx } from 'class-variance-authority'

import { LINKS } from '@/config/links'

import { Link } from '../link'
import { Logo } from '../logo'

const FloatingMenuMobile = () => {
  const [visible, setVisible] = useState(false)
  const [open, setOpen] = useState(false)

  // Using ref to prevent re-running of useEffect
  const visibleRef = useRef(visible)
  visibleRef.current = visible
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 60) {
        visibleRef.current === false && setVisible(true)
      } else {
        visibleRef.current === true && setVisible(false)
        setOpen(false)
      }
    }

    const isDesktop = window.innerWidth > 768

    if (isDesktop) return
    handleScroll()

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 0

  return (
    <>
      {visible && (
        <div
          className={cx([
            'fixed left-1/2 top-5 z-10 flex  -translate-x-1/2 flex-col items-center justify-between p-2 pb-0 lg:hidden',
            'bg-blur-neutral-80/80 border-neutral-80/5 rounded-2xl border backdrop-blur-md',
            ' w-max min-w-[366px]',
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
              icon={open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
              onPress={() => setOpen(!open)}
            />
          </div>
          <div
            style={{
              height: open ? screenHeight - 100 : 0,
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              overflow: open ? 'auto' : 'hidden',
            }}
            className={`z-10 flex w-full flex-col justify-between pt-2 transition-all duration-300`}
          >
            <div className="flex flex-col">
              {Object.entries(LINKS).map(([name, links]) => (
                <Accordion.Root
                  key={name}
                  type="single"
                  collapsible
                  className={`accordion-root flex flex-col pt-3`}
                >
                  <Accordion.Item
                    key={name}
                    value={name}
                    className="accordion-item"
                  >
                    <div>
                      <Accordion.Trigger className="accordion-trigger">
                        <div className="accordion-chevron inline-flex h-5 w-5">
                          <ChevronRightIcon size={20} color="$white-100" />
                        </div>
                        <Text size={19} weight="medium" color={'$white-100'}>
                          {name}
                        </Text>
                      </Accordion.Trigger>
                      <Accordion.Content className="accordion-content">
                        <div className="overflow-hidden py-5">
                          {open &&
                            links.map((link, index) => {
                              const paddingClassName =
                                index === 0 ? 'pt-5' : 'pt-3'
                              const paddingLastChild =
                                index === links.length - 1 ? 'pb-5' : ''

                              const external = link.href.startsWith('http')
                              return (
                                <div
                                  key={link.name + index}
                                  className={`transition-opacity hover:opacity-50 ${paddingClassName} ${paddingLastChild}`}
                                >
                                  <Link
                                    href={link.href}
                                    className="flex items-center gap-1"
                                  >
                                    <Text
                                      size={15}
                                      weight="medium"
                                      color="$white-100"
                                    >
                                      {link.name}
                                    </Text>

                                    {external && (
                                      <ExternalIcon
                                        size={20}
                                        color="$white-100"
                                      />
                                    )}
                                  </Link>
                                </div>
                              )
                            })}
                        </div>
                      </Accordion.Content>
                    </div>
                  </Accordion.Item>
                </Accordion.Root>
              ))}
            </div>
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
