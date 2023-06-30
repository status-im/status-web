import { useEffect, useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { useRouter } from 'next/router'

import { NavLink } from './nav-link'
import { NavNestedLinks } from './nav-nested-links'
import { SkeletonPlaceholder } from './skeleton-placeholder'
import { decodeUriComponent } from './utils'

type Props = {
  isLoading?: boolean
  items: {
    label: string
    href?: string
    links?: {
      label: string
      href: string
      links?: {
        label: string
        href: string
      }[]
    }[]
  }[]
}

const SidebarMenu = (props: Props) => {
  const { items, isLoading } = props

  const [label, setLabel] = useState<string>('')

  const { asPath } = useRouter()

  const defaultLabel = items?.find(
    item =>
      item.href === decodeUriComponent(asPath) ||
      item.links?.find(link => link.href === decodeUriComponent(asPath))
  )?.label

  useEffect(() => {
    setLabel(defaultLabel || '')
  }, [defaultLabel])

  return (
    <div className="border-r border-neutral-10 p-5">
      <aside className=" sticky top-5 min-w-[320px]">
        {isLoading ? (
          <SkeletonPlaceholder />
        ) : (
          <Accordion.Root
            type="single"
            collapsible
            value={label}
            onValueChange={value => setLabel(value)}
            className="accordion-root flex flex-col gap-3"
          >
            {items?.map((item, index) => {
              if (item.links && item.links.length > 0) {
                return (
                  <NavNestedLinks
                    key={index}
                    label={item.label}
                    links={item.links}
                  />
                )
              }

              return (
                <Accordion.Item key={item.label} value={item.label}>
                  <Accordion.Trigger
                    className="accordion-trigger"
                    onClick={() => setLabel(item.label)}
                  >
                    <NavLink href={item.href || ''}>{item.label}</NavLink>
                  </Accordion.Trigger>
                </Accordion.Item>
              )
            })}
          </Accordion.Root>
        )}
      </aside>
    </div>
  )
}

export { SidebarMenu }
export type { Props as SidebarMenuProps }
