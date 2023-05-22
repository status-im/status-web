import { useEffect, useState } from 'react'

import { useRouter } from 'next/router'

import { NavLink } from './nav-link'
import { NavNestedLinks } from './nav-nested-links'

import type { Url } from 'next/dist/shared/lib/router/router'

type Props = {
  data?: {
    label: string
    href?: Url
    links?: {
      label: string
      href: Url
    }[]
  }[]
}

const SideMenu = (props: Props) => {
  const { data } = props
  // Store the current active link in state
  const { asPath } = useRouter()
  const [activeLink, setActiveLink] = useState<Url>('')

  // Handle the click event for the nested links
  const handleLinkClick = (href: Url) => {
    setActiveLink(href)
  }

  useEffect(() => {
    // Update the active link when the path changes
    setActiveLink(asPath)
  }, [asPath])

  return (
    <div className="border-neutral-10 border-r p-5">
      <aside className=" sticky top-5 flex min-w-[320px] flex-col gap-3 ">
        {data?.map((item, index) => {
          if (item.links) {
            return (
              <NavNestedLinks
                key={index}
                label={item.label}
                links={item.links}
                onClick={handleLinkClick}
                activeLink={activeLink}
              />
            )
          }

          return (
            <NavLink
              key={index}
              href={item.href || ''}
              handleLinkClick={handleLinkClick}
            >
              {item.label}
            </NavLink>
          )
        })}
      </aside>
    </div>
  )
}

export { SideMenu }
