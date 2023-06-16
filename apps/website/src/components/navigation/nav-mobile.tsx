import { useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { Button, IconButton, Text } from '@status-im/components'
import {
  ChevronRightIcon,
  CloseIcon,
  DownloadIcon,
  ExternalIcon,
  MenuIcon,
} from '@status-im/icons'

import { Logo } from '@/components/logo'
import { LINKS } from '@/config/links'

import { Link } from '../link'

const NavMobile = () => {
  const [open, setOpen] = useState(false)

  const screenHeight = typeof window !== 'undefined' ? window.innerHeight : 0

  const handleToggle = () => {
    setOpen(prevOpen => !prevOpen)

    // Adds the following code to disable scrolling when the menu is open
    const rootElement = document.documentElement
    if (open) {
      rootElement.style.overflowY = 'auto'
    } else {
      rootElement.style.overflowY = 'hidden'
    }
  }

  return (
    <div className="md-lg:hidden z-10 flex flex-col items-center justify-between px-5">
      <div className="z-10 flex w-full items-center justify-between py-3">
        <div className="flex">
          <Link href="/">
            <Logo />
          </Link>
        </div>

        <IconButton
          variant="outline"
          icon={open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
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
        <div className="flex flex-col">
          {Object.entries(LINKS).map(([name, links]) => (
            <Accordion.Root
              key={name}
              type="single"
              collapsible
              className="accordion-root flex flex-col pt-3"
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
                      {links.map((link, index) => {
                        const paddingClassName = index === 0 ? 'pt-5' : 'pt-3'
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
                                <ExternalIcon size={20} color="$white-100" />
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
  )
}

export { NavMobile }
