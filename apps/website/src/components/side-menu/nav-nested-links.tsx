import { useEffect, useState } from 'react'

import { animated, config, useSpring } from '@react-spring/web'
import { Text } from '@status-im/components'
import { ChevronRightIcon } from '@status-im/icons'
import { useRouter } from 'next/router'

import { Link } from '../link'

import type { Url } from 'next/dist/shared/lib/router/router'

type NavLinkProps = {
  onClick: (href: Url) => void
  label: string
  activeLink: Url
  links: {
    label: string
    href: Url
  }[]
}

const NavNestedLinks = (props: NavLinkProps) => {
  const { label, activeLink, links, onClick } = props

  const { asPath } = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const toggleAccordion = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    // Check if any of the nested links match the active path
    const isActive = links.some(link => activeLink === link.href)

    // Set the accordion state based on the active path
    setIsOpen(isActive)
  }, [activeLink, links])

  const contentAnimation = useSpring({
    maxHeight: isOpen ? 1000 : 0,
    opacity: isOpen ? 1 : 0,
    config: {
      duration: 250,
    },
  })

  const rotateChevronAnimation = useSpring({
    transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)',
    config: config.default,
  })

  return (
    <div className="inline-flex h-auto cursor-pointer flex-col">
      <button className="flex flex-row items-center" onClick={toggleAccordion}>
        <animated.div
          className="inline-flex h-5 w-5"
          style={rotateChevronAnimation}
        >
          <ChevronRightIcon size={20} />
        </animated.div>
        <Text size={19} weight="medium" color={'$neutral-100'}>
          {label}
        </Text>
      </button>

      <animated.div
        style={{
          ...contentAnimation,
          overflow: 'hidden',
          paddingLeft: 20,
        }}
      >
        {links.map((link, index) => {
          const active = asPath === link.href

          const paddingClassName = index === 0 ? 'pt-5' : 'pt-2'
          const paddingLastChild = index === links.length - 1 ? 'pb-5' : ''

          return (
            <div
              key={link.label + index}
              className={`transition-opacity hover:opacity-50 ${paddingClassName} ${paddingLastChild}`}
            >
              <Link href={link.href} onClick={() => onClick(link.href)}>
                <Text
                  size={15}
                  weight="medium"
                  color={active ? '$neutral-50' : '$neutral-100'}
                >
                  {link.label}
                </Text>
              </Link>
            </div>
          )
        })}
      </animated.div>
    </div>
  )
}

export { NavNestedLinks }
