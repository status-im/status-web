import { useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { Text } from '@status-im/components'
import { ChevronRightIcon, ExternalIcon } from '@status-im/icons'

import { ROUTES } from '@/config/routes'

import { Link } from '../link'

const AccordionMenu = () => {
  const [openLink, setOpenLink] = useState('')

  const handleToggle = (value: string) => {
    setOpenLink(value === openLink ? '' : value)
  }

  return (
    <div className="flex flex-col px-3">
      {Object.entries(ROUTES).map(([name, routes]) => (
        <Accordion.Root
          key={name}
          type="single"
          collapsible
          value={openLink}
          onValueChange={handleToggle}
          className="accordion-root flex flex-col pb-3 first-of-type:pt-3"
        >
          <Accordion.Item key={name} value={name} className="accordion-item">
            <div>
              <Accordion.Trigger className="accordion-trigger">
                <div className="accordion-chevron inline-flex h-5 w-5">
                  <ChevronRightIcon size={20} color="$white-100" />
                </div>
                <Text size={19} weight="medium" color={'$white-100'}>
                  {name}
                </Text>
              </Accordion.Trigger>
              <Accordion.Content className="accordion-content pl-5">
                <div className="overflow-hidden">
                  {routes.map((route, index) => {
                    const external = route.href.startsWith('http')
                    return (
                      <div
                        key={route.name + index}
                        className={`pt-3 transition-opacity first-of-type:pt-5 last-of-type:pb-5 hover:opacity-50`}
                      >
                        <Link
                          href={route.href}
                          className="flex items-center gap-1"
                        >
                          <Text size={15} weight="medium" color="$white-100">
                            {route.name}
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
  )
}

export { AccordionMenu }
