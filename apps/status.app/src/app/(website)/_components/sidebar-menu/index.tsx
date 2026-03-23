'use client'

import { useEffect, useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'

import { usePathname } from '~/i18n/navigation'

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

  const [value, setValue] = useState<string>()

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

    setValue(match.href)
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
          value={value}
          onValueChange={nextValue => setValue(nextValue)}
          className="flex flex-col gap-3"
        >
          {items?.map((item, index) => {
            if (item.links && item.links.length > 0) {
              return (
                <NavNestedLinks
                  key={index}
                  value={item.href}
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
              <Accordion.Item key={item.href} value={item.href}>
                <Accordion.Trigger onClick={() => setValue(item.href)}>
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
