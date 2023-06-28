import * as Accordion from '@radix-ui/react-accordion'
import {} from '@radix-ui/react-accordion'
import { Text } from '@status-im/components'
import { ChevronRightIcon } from '@status-im/icons'
import { useRouter } from 'next/router'

import { Link } from '../link'

import type { Url } from 'next/dist/shared/lib/router/router'

type NavLinkProps = {
  label: string
  links: {
    label: string
    href: Url
    links?: {
      label: string
      href: Url
    }[]
  }[]
}

const NavNestedLinks = (props: NavLinkProps) => {
  const { label, links } = props

  const { asPath } = useRouter()

  return (
    <Accordion.Item value={label} className="accordion-item">
      <div>
        <Accordion.Trigger className="accordion-trigger">
          <div className="accordion-chevron inline-flex h-5 w-5">
            <ChevronRightIcon size={20} />
          </div>
          <Text size={19} weight="medium" color={'$neutral-100'}>
            {label}
          </Text>
        </Accordion.Trigger>
        <Accordion.Content className="accordion-content">
          <div
            style={{
              overflow: 'hidden',
              paddingLeft: 20,
            }}
          >
            {links.map((link, index) => {
              const active = asPath === link.href

              const paddingClassName = index === 0 ? 'pt-5' : 'pt-2'
              const paddingLastChild = index === links.length - 1 ? 'pb-5' : ''

              if (link.links && link.links.length > 0) {
                return (
                  <div key={link.label + index}>
                    <Text size={13} color="$neutral-50" weight="medium">
                      {link.label}
                    </Text>
                    {link.links.map((sublink, subindex) => {
                      return (
                        <div
                          key={sublink.label + subindex}
                          className={`transition-opacity hover:opacity-50 ${paddingClassName} ${paddingLastChild}`}
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
                <div
                  key={link.label + index}
                  className={`transition-opacity hover:opacity-50 ${paddingClassName} ${paddingLastChild}`}
                >
                  <Link href={link.href}>
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
          </div>
        </Accordion.Content>
      </div>
    </Accordion.Item>
  )
}

export { NavNestedLinks }
