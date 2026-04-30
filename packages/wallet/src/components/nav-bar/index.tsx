'use client'

import { SettingsIcon } from '@status-im/icons/20'

import { FeedbackPopover } from '../feedback'
import { Logo } from '../logo'

import type { AnchorHTMLAttributes, ReactNode } from 'react'

type LinkComponentProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  children: ReactNode
}

type Props = {
  hasFeedback?: boolean
  linkComponent?: React.ComponentType<LinkComponentProps>
  rightSlot?: ReactNode
  settingsHref?: string
}

const Navbar = (props: Props) => {
  const { linkComponent: LinkComponent = 'a' } = props

  return (
    <div
      data-theme="dark"
      className="sticky top-0 z-20 flex h-14 flex-1 items-center justify-between bg-neutral-100 pr-1"
    >
      <div className="flex items-center pl-3 lg:pl-6">
        <LinkComponent
          href="/"
          className="flex w-[32px] min-w-[32px] overflow-hidden lg:w-auto"
        >
          <Logo isTopbarDesktop />
        </LinkComponent>
      </div>
      <div className="flex items-center gap-1">
        {props.rightSlot}
        {props.hasFeedback && <FeedbackPopover />}
        {props.settingsHref && (
          <LinkComponent
            href={props.settingsHref}
            aria-label="Settings"
            title="Settings"
            className="opacity-40 hover:opacity-100 flex h-8 w-8 items-center justify-center rounded-10 text-white-100 transition-opacity"
          >
            <SettingsIcon />
          </LinkComponent>
        )}
      </div>
    </div>
  )
}

export { Navbar }
