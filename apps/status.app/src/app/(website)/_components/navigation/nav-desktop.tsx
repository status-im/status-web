'use client'

import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useTranslations } from 'next-intl'

import { ROUTES } from '~/config/routes'
import { Link } from '~components/link'
import { Logo } from '~components/logo'

import { DownloadDesktopButton } from '../download-desktop-button'
import { DownloadMobileButton } from '../download-mobile-button'
import { LanguageSelector } from './language-selector'
import { useDesktopMenu } from './use-desktop-menu'

const NavDesktop = () => {
  const t = useTranslations('nav')
  const {
    value,
    handleContentMouseEnter,
    handleContentMouseLeave,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
    handleContentLeave,
    handleTriggerKeyDown,
  } = useDesktopMenu()

  return (
    <>
      <NavigationMenu.Root
        className="relative z-20 hidden [@media(min-width:1150px)]:block"
        value={value}
        onMouseLeave={handleContentMouseLeave}
      >
        <div className="flex items-center px-6">
          <div className="mr-[10px] flex shrink-0">
            <Link href="/">
              <Logo isTopbarDesktop />
            </Link>
          </div>

          <div className="flex-1">
            <NavigationMenu.List className="flex items-center">
              {Object.entries(ROUTES).map(([nameKey, routes]) => (
                <NavigationMenu.Item key={nameKey} value={nameKey}>
                  <NavigationMenu.Trigger
                    aria-expanded={value === nameKey}
                    className="px-[10px] py-4 transition-opacity aria-expanded:opacity-[50%]"
                    onMouseEnter={() => handleTriggerMouseEnter(nameKey)}
                    onMouseLeave={handleTriggerMouseLeave}
                    onKeyDown={event => handleTriggerKeyDown(event, nameKey)}
                  >
                    <Text size={15} weight="medium" color="$white-100">
                      {t(nameKey)}
                    </Text>
                  </NavigationMenu.Trigger>

                  <NavigationMenu.Content
                    className="grid pb-12 pl-[76px] lg:pl-[164px]"
                    onMouseEnter={handleContentMouseEnter}
                  >
                    {routes.map(route => {
                      const external = route.href.startsWith('http')

                      return (
                        <NavigationMenu.Link key={route.nameKey} asChild>
                          <Link
                            onClick={handleContentLeave}
                            href={route.href}
                            className="flex items-center gap-1 pt-3 text-white-100 transition-opacity hover:opacity-[50%]"
                          >
                            <Text size={27} weight="semibold">
                              {t(route.nameKey)}
                            </Text>
                            {external && <ExternalIcon />}
                          </Link>
                        </NavigationMenu.Link>
                      )
                    })}
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              ))}
            </NavigationMenu.List>
          </div>

          <div
            data-theme="dark"
            className={cx(
              'hidden items-center justify-end gap-2',
              'macos:flex windows:flex linux:flex unknown:flex'
            )}
          >
            <DownloadDesktopButton size="32" variant="darkGrey" show="all" />
            <DownloadMobileButton size="32" variant="outline" />
            <LanguageSelector />
          </div>

          <div
            data-theme="dark"
            className={cx(
              'hidden items-center justify-end gap-2',
              'ios:flex android:flex'
            )}
          >
            <DownloadDesktopButton size="32" variant="darkGrey" show="all" />
            <DownloadMobileButton size="32" variant="outline" />
            <LanguageSelector />
          </div>
        </div>
        <NavigationMenu.Viewport
          className={cx([
            'overflow-hidden data-[state=closed]:animate-heightOut data-[state=open]:animate-heightIn',
            'h-[var(--radix-navigation-menu-viewport-height)] transition-height',
          ])}
        />
      </NavigationMenu.Root>
    </>
  )
}

export { NavDesktop }
