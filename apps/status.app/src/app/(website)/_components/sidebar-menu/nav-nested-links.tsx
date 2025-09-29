'use client'

import * as Accordion from '@radix-ui/react-accordion'
import { Text } from '@status-im/components'
import { ChevronRightIcon } from '@status-im/icons/20'
import { usePathname } from 'next/navigation'

import { Link } from '~components/link'

import { appendDateQueryParams, decodeUriComponent } from './utils'

type NavLinkProps = {
  label: string
  links: Array<{
    label: string
    href: string
    links?: Array<{
      label: string
      href: string
    }>
  }>
}

const NavNestedLinks = (props: NavLinkProps) => {
  const { label, links } = props

  const pathname = usePathname()!

  return (
    <Accordion.Item value={label}>
      <div>
        <Accordion.Trigger className="group flex w-full items-center gap-0.5">
          <ChevronRightIcon className="transition-transform group-aria-expanded:rotate-90" />
          <Text size={19} weight="medium" color="$neutral-100">
            {label}
          </Text>
        </Accordion.Trigger>
        <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-hide data-[state=open]:animate-accordion-reveal">
          <div className="overflow-hidden pl-[22px]">
            {links.map(link => {
              const active = decodeUriComponent(pathname) === link.href

              if (link.links && link.links.length > 0) {
                return (
                  <div key={link.href}>
                    <Text size={13} color="$neutral-50" weight="medium">
                      {link.label}
                    </Text>
                    {link.links.map(sublink => {
                      return (
                        <div
                          key={sublink.href}
                          className="pt-2 transition-opacity first:pt-5 last:pb-5 hover:opacity-[50%]"
                        >
                          <Link href={sublink.href}>
                            <Text
                              size={15}
                              weight="medium"
                              color={active ? '$neutral-50' : '$neutral-100'}
                            >
                              {sublink.label}
                            </Text>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                )
              }

              return (
                <Link
                  key={link.href}
                  className="flex pt-2 transition-opacity first:pt-5 last:pb-5 hover:opacity-[50%]"
                  href={appendDateQueryParams(link.href)}
                >
                  <Text
                    size={15}
                    weight="medium"
                    color={active ? '$neutral-50' : '$neutral-100'}
                    truncate
                  >
                    {link.label}
                  </Text>
                </Link>
              )
            })}
          </div>
        </Accordion.Content>
      </div>
    </Accordion.Item>
  )
}

export { NavNestedLinks }
