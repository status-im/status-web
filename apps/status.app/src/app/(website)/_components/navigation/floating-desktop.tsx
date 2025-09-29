import * as NavigationMenu from '@radix-ui/react-navigation-menu'
import { Text } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

import { ROUTES } from '~/config/routes'
import { Link } from '~components/link'
import { Logo } from '~components/logo'

import { DownloadDesktopButton } from '../download-desktop-button'
import { useDesktopMenu } from './use-desktop-menu'

type Props = {
  visible: boolean
}

const FloatingDesktop = (props: Props) => {
  const { visible } = props

  const {
    value,
    handleContentMouseEnter,
    handleContentMouseLeave,
    handleTriggerMouseEnter,
    handleTriggerMouseLeave,
    handleContentLeave,
  } = useDesktopMenu()

  return (
    <NavigationMenu.Root
      data-visible={visible}
      onMouseLeave={handleContentMouseLeave}
      value={value}
      data-theme="dark"
      data-background="blur"
      className={cx([
        'data-[visible=false]:pointer-events-none',
        'data-[visible=true]:pointer-events-auto',
        'opacity-[0%] transition-opacity data-[visible=true]:opacity-[100%]',
      ])}
    >
      <div className="flex items-center p-2">
        <Link href="/">
          <Logo label={false} />
        </Link>
        <NavigationMenu.List className="flex items-center pl-5 pr-4">
          {Object.entries(ROUTES).map(([name, links]) => (
            <NavigationMenu.Item key={name} value={name}>
              <NavigationMenu.Trigger
                aria-expanded={value === name}
                className="pr-5 transition-opacity aria-expanded:opacity-[50%]"
                onMouseEnter={handleTriggerMouseEnter}
                onMouseLeave={handleTriggerMouseLeave}
              >
                <Text size={15} weight="medium" color="$white-100">
                  {name}
                </Text>
              </NavigationMenu.Trigger>

              <NavigationMenu.Content
                onMouseEnter={handleContentMouseEnter}
                className={cx([
                  'grid pb-12 pl-[60px]',
                  'data-[state=open]:animate-in',
                  'fade-out-[20%] data-[state=closed]:animate-out',
                ])}
              >
                {links.map(link => {
                  const external = link.href.startsWith('http')
                  return (
                    <NavigationMenu.Link key={link.name} asChild>
                      <Link
                        onClick={handleContentLeave}
                        href={link.href}
                        className="flex items-center gap-1 pt-3 text-white-100 transition-opacity hover:opacity-[50%]"
                      >
                        <Text size={27} weight="semibold">
                          {link.name}
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

        <div className="flex flex-row gap-2">
          <DownloadDesktopButton size="40" variant="primary" show="all" />
        </div>
      </div>

      <NavigationMenu.Viewport
        className={cx([
          'data-[state=closed]:animate-heightOut data-[state=open]:animate-heightIn',
          'h-[var(--radix-navigation-menu-viewport-height)] transition-height',
        ])}
      />
    </NavigationMenu.Root>
  )
}

export { FloatingDesktop }
