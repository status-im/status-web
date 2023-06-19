import { useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { Text } from '@status-im/components'
import { ChevronRightIcon, ExternalIcon } from '@status-im/icons'

import { LINKS } from '@/config/links'

import { Link } from '../link'

const AccordionMenu = () => {
  const [openLink, setOpen] = useState('')

  const handleToggle = (value: string) => {
    setOpen(value === openLink ? '' : value)
  }

  return (
    <div className="flex flex-col px-3">
      {Object.entries(LINKS).map(([name, links]) => (
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
                  {links.map((link, index) => {
                    const external = link.href.startsWith('http')
                    return (
                      <div
                        key={link.name + index}
                        className={`pt-3 transition-opacity first-of-type:pt-5 last-of-type:pb-5 hover:opacity-50`}
                      >
                        <Link
                          href={link.href}
                          className="flex items-center gap-1"
                        >
                          <Text size={15} weight="medium" color="$white-100">
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
  )
}

export { AccordionMenu }
