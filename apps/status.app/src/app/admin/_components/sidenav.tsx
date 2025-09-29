'use client'

import { cloneElement } from 'react'

import { Avatar, IconButton } from '@status-im/components'
import { CheckCircleIcon as CheckCircleIcon12 } from '@status-im/icons/12'
import { CheckCircleIcon as CheckCircleIcon16 } from '@status-im/icons/16'
import { CollapseLsIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useLayoutContext } from '~admin/_contexts/layout-context'
import { Tooltip } from '~components/tooltip'

import type { IconElement } from '@status-im/components'

type LinkProp = {
  name: string
  href: string
  done?: boolean
}

type LinkWithIcon = LinkProp & {
  icon: IconElement
}

type LinkWithAvatar = LinkProp & {
  src?: string
}

type Props = {
  links: Array<LinkWithIcon | LinkWithAvatar>
}

const SideNav = (props: Props) => {
  const pathname = usePathname()
  const { links } = props

  const { sideNavExpanded, toggleSideNav } = useLayoutContext()

  return (
    <div
      className={cx([
        'z-20 flex shrink-0 flex-col items-start gap-2 border-r border-neutral-10 bg-white-100 p-3 transition-all',
        sideNavExpanded ? '4xl:w-[320px]' : 'w-14',
      ])}
    >
      {links.map(link => {
        const active = pathname!.startsWith(link.href)

        return (
          <Tooltip key={link.name} label={link.name} hidden={sideNavExpanded}>
            <div className="flex w-full">
              <Link
                href={link.href}
                className={cx(
                  'flex h-8 w-full items-center justify-start gap-[6px] overflow-hidden whitespace-nowrap rounded-10 border border-transparent transition-colors hover:bg-neutral-20',
                  {
                    'border-neutral-20 bg-neutral-10': active,
                  }
                )}
              >
                <div className="ml-[5px] flex shrink-0">
                  {'icon' in link &&
                    cloneElement(link.icon, {
                      className: cx(
                        'text-neutral-50',
                        active ? 'text-neutral-100' : ''
                      ),
                    })}

                  {'src' in link && (
                    <div className="relative">
                      <Avatar
                        type="user"
                        size="20"
                        src={link.src}
                        name={link.name}
                      />
                      {link.done && (
                        <div className="absolute right-[-4px] top-[-4px] z-10 flex size-[14px] items-center justify-center rounded-full bg-white-100 4xl:hidden">
                          <CheckCircleIcon12 />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <span className="flex w-0 items-center justify-between gap-2 text-15 font-500 opacity-[0] transition-all 4xl:mr-2 4xl:w-full 4xl:opacity-[1]">
                  {link.name}
                  {'done' in link && link.done && <CheckCircleIcon16 />}
                </span>
              </Link>
            </div>
          </Tooltip>
        )
      })}
      <div className="flex-1" />
      <div className="hidden w-full flex-col items-end gap-2 4xl:flex">
        <div
          className={cx(
            'flex size-8 flex-none items-center justify-center gap-2 rounded-10 transition-all',
            sideNavExpanded ? 'rotate-0' : 'rotate-180'
          )}
        >
          <IconButton
            onPress={toggleSideNav}
            variant="ghost"
            icon={<CollapseLsIcon />}
          />
        </div>
      </div>
    </div>
  )
}

export { SideNav }
