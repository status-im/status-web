'use client'

import { useEffect, useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { usePathname } from 'next/navigation'

import { NavLink } from './nav-link'
import { NavNestedLinks } from './nav-nested-links'
import { SkeletonPlaceholder } from './skeleton-placeholder'
import { decodeUriComponent } from './utils'

type Props = {
  isLoading?: boolean
  items: Array<{
    label: string
    href: string
    links?: Array<{
      label: string
      href: string
      links?: Array<{
        label: string
        href: string
      }>
    }>
  }>
}

const SidebarMenu = (props: Props) => {
  const { items, isLoading } = props

  const pathname = usePathname()!

  const [label, setLabel] = useState<string>()

  useEffect(() => {
    const match = items.find(
      item =>
        item.href === decodeUriComponent(pathname) ||
        item.links?.find(link => link.href === decodeUriComponent(pathname)) ||
        decodeUriComponent(pathname).startsWith(item.href) // fallback, leaves root item open
    )

    if (!match) {
      return
    }

    setLabel(match.label)
  }, [pathname, items])

  return (
    <aside className="w-[320px] p-5 pb-28">
      {isLoading ? (
        <div className="p-5">
          <SkeletonPlaceholder />
        </div>
      ) : (
        <Accordion.Root
          type="single"
          collapsible
          value={label}
          onValueChange={value => setLabel(value)}
          className="flex flex-col gap-3"
        >
          {items?.map((item, index) => {
            if (item.links && item.links.length > 0) {
              return (
                <NavNestedLinks
                  key={index}
                  label={item.label}
                  links={item.links.map(link => {
                    // We need to encode the epic name in the URL due to the use of the slash character
                    const split = link.href.split('/E:')

                    if (split.length > 1) {
                      const encodedEpicName = encodeURIComponent(split[1])
                      const encondedLink = `${split[0]}/E:${encodedEpicName}`

                      return {
                        ...link,
                        href: encondedLink,
                      }
                    }

                    return link
                  })}
                />
              )
            }

            return (
              <Accordion.Item key={item.label} value={item.label}>
                <Accordion.Trigger onClick={() => setLabel(item.label)}>
                  <NavLink href={item.href}>{item.label}</NavLink>
                </Accordion.Trigger>
              </Accordion.Item>
            )
          })}
        </Accordion.Root>
      )}
    </aside>
  )
}

export { SidebarMenu }
export type { Props as SidebarMenuProps }
