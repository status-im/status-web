import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Button, Text } from '@status-im/components'
import { DownloadIcon, ExternalIcon } from '@status-im/icons'
import { cx } from 'class-variance-authority'

import { Logo } from '@/components/logo'
import { ROUTES } from '@/config/routes'

import { Link } from '../link'

const NavDesktop = () => {
  return (
    <>
      <NavigationMenu.Root className="relative z-10 hidden md-lg:block">
        <div className="flex items-center px-6">
          <div className="mr-5 flex shrink-0 ">
            <Link href="/">
              <Logo isTopbarDesktop />
            </Link>
          </div>

          <div className="flex-1">
            <NavigationMenu.List className="flex items-center">
              {Object.entries(ROUTES).map(([name, routes]) => (
                <NavigationMenu.Item key={name}>
                  <NavigationMenu.Trigger className="py-4 pr-5 aria-expanded:opacity-50">
                    <Text size={15} weight="medium" color="$white-100">
                      {name}
                    </Text>
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content className="grid gap-3 pb-8 pl-[164px] pt-3">
                    {routes.map(route => {
                      const external = route.href.startsWith('http')

                      return (
                        <NavigationMenu.Link key={route.name} asChild>
                          <Link
                            href={route.href}
                            className="flex items-center gap-1"
                          >
                            <Text
                              size={27}
                              weight="semibold"
                              color="$white-100"
                            >
                              {route.name}
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
          </div>

          <div className="flex justify-end ">
            <Button
              size={32}
              variant="darkGrey"
              icon={<DownloadIcon size={20} />}
            >
              Sign up for early access
            </Button>
          </div>
        </div>
        <NavigationMenu.Viewport
          className={cx([
            'data-[state=closed]:animate-heightOut data-[state=open]:animate-heightIn',
            'h-[var(--radix-navigation-menu-viewport-height)] transition-height',
            // 'data-[state=open]:animate-heightIn animate-',
            // 'data-[state=closed]:animate-heightOut',
            // 'transition-height h-[var(--radix-navigation-menu-viewport-height)]',
            // 'transition-height mb-8 h-[var(--radix-navigation-menu-viewport-height)] duration-1000',
            // 'h-[var(--radix-navigation-menu-viewport-height)]',
            // 'data-[state=open]:animate-scaleIn data-[state=closed]:animate-scaleOut relative mt-[10px] h-[var(--radix-navigation-menu-viewport-height)] w-full origin-[top_center] overflow-hidden rounded-[6px] bg-white transition-[width,height] duration-300 sm:w-[var(--radix-navigation-menu-viewport-width)]',
          ])}
        />
      </NavigationMenu.Root>
    </>
  )
}

export { NavDesktop }
