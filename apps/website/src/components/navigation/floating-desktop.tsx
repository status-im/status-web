import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Button, Text } from '@status-im/components'
import { DownloadIcon, ExternalIcon } from '@status-im/icons'
import { cx } from 'class-variance-authority'

import { LINKS } from '@/config/links'

import { Link } from '../link'
import { Logo } from '../logo'

type Props = {
  visible: boolean
}

const FloatingDesktop = (props: Props) => {
  const { visible } = props

  return (
    <NavigationMenu.Root
      data-visible={visible}
      className={cx([
        'data-[visible=false]:pointer-events-none',
        'data-[visible=true]:pointer-events-auto',
        'opacity-0 transition-opacity data-[visible=true]:opacity-100',
      ])}
    >
      <div className="flex items-center p-2">
        <Logo label={false} />
        <NavigationMenu.List className="flex items-center pl-5">
          {Object.entries(LINKS).map(([name, links]) => (
            <NavigationMenu.Item key={name}>
              <NavigationMenu.Trigger className="pr-5 aria-expanded:opacity-50">
                <Text size={15} weight="medium" color="$white-100">
                  {name}
                </Text>
              </NavigationMenu.Trigger>

              <NavigationMenu.Content
                className={cx([
                  'grid gap-3 pb-12 pl-[60px] pt-6',
                  'data-[state=open]:animate-in',
                  'data-[state=closed]:animate-out fade-out-20',
                ])}
              >
                {links.map(link => {
                  const external = link.href.startsWith('http')
                  return (
                    <NavigationMenu.Link key={link.name} asChild>
                      <Link
                        href={link.href}
                        className="flex items-center gap-1"
                      >
                        <Text size={27} weight="semibold" color="$white-100">
                          {link.name}
                        </Text>
                        {external && (
                          <ExternalIcon size={20} color="$white-100" />
                        )}
                      </Link>
                    </NavigationMenu.Link>
                  )
                })}
              </NavigationMenu.Content>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>

        <Button size={32} icon={<DownloadIcon size={20} />}>
          Sign up for early access
        </Button>
      </div>

      <NavigationMenu.Viewport
        className={cx([
          'data-[state=open]:animate-heightIn data-[state=closed]:animate-heightOut',
          'transition-height h-[var(--radix-navigation-menu-viewport-height)]',
        ])}
      />
    </NavigationMenu.Root>
  )
}

export { FloatingDesktop }
