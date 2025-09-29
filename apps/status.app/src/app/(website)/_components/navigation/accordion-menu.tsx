'use client'

import { useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { Text } from '@status-im/components'
import { ChevronRightIcon, ExternalIcon } from '@status-im/icons/20'

import { ROUTES } from '~/config/routes'
import { Link } from '~components/link'

const AccordionMenu = () => {
  const [openLink, setOpenLink] = useState('')

  const handleToggle = (value: string) => {
    setOpenLink(value === openLink ? '' : value)
  }

  return (
    <div className="grid gap-3">
      {Object.entries(ROUTES).map(([name, routes]) => (
        <Accordion.Root
          key={name}
          type="single"
          collapsible
          value={openLink}
          onValueChange={handleToggle}
        >
          <Accordion.Item key={name} value={name}>
            <Accordion.Trigger className="group flex w-full items-center gap-1 text-white-100">
              <ChevronRightIcon className="transition-transform group-aria-expanded:rotate-90" />
              <Text size={19} weight="medium">
                {name}
              </Text>
            </Accordion.Trigger>

            <Accordion.Content>
              <div className="grid gap-3 overflow-hidden px-5 pb-8 pt-5">
                {routes.map((route, index) => {
                  const external = route.href.startsWith('http')
                  return (
                    <div
                      key={route.name + index}
                      className="transition-opacity hover:opacity-[50%]"
                    >
                      <Link
                        href={route.href}
                        className="flex items-center gap-1 text-white-100"
                      >
                        <Text size={15} weight="medium">
                          {route.name}
                        </Text>
                        {external && <ExternalIcon />}
                      </Link>
                    </div>
                  )
                })}
              </div>
            </Accordion.Content>
          </Accordion.Item>
        </Accordion.Root>
      ))}
    </div>
  )
}

export { AccordionMenu }
