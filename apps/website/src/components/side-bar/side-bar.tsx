import { useEffect, useState } from 'react'

import * as Accordion from '@radix-ui/react-accordion'
import { useRouter } from 'next/router'

import { NavLink } from './nav-link'
import { NavNestedLinks } from './nav-nested-links'
import { SkeletonPlaceholder } from './skeleton-placeholder'

import type { Url } from 'next/dist/shared/lib/router/router'

type Props = {
  isLoading?: boolean
  data?: {
    label: string
    href?: Url
    links?: {
      label: string
      href: Url
    }[]
  }[]
}

const SideBar = (props: Props) => {
  const { data, isLoading } = props

  const [label, setLabel] = useState<string>('')

  const { asPath } = useRouter()

  const defaultLabel = data?.find(
    item =>
      item.href === asPath || item.links?.find(link => link.href === asPath)
  )?.label

  useEffect(() => {
    setLabel(defaultLabel || '')
  }, [defaultLabel])

  return (
    <div className="border-r border-neutral-10 p-5">
      <aside className="sticky top-5 min-w-[320px]">
        {isLoading ? (
          <SkeletonPlaceholder />
        ) : (
          <Accordion.Root
            type="single"
            collapsible
            value={label}
            onValueChange={value => setLabel(value)}
            className="flex flex-col gap-3"
          >
            {data?.map((item, index) => {
              if (item.links) {
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

export { SideBar }
