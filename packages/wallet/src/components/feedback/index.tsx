'use client'

import { useState } from 'react'

import { DropdownMenu } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/20'
import { Link } from 'react-aria-components'

import { DropdownIcon } from './dropdown-icon'

const FEEDBACK_LINKS = [
  {
    label: 'Message us',
    href: 'https://forms.gle/jJLiuHffWrL1wmbP7',
  },
  {
    label: 'Submit bug',
    href: 'https://github.com/status-im/status-web/issues/new?template=bug_report.md',
  },
  {
    label: 'Request feature',
    href: 'https://discuss.status.app/c/features/51',
  },
]

const FeedbackPopover = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen}>
      <button className="flex cursor-pointer select-none items-center rounded-10 border border-neutral-70 hover:border-neutral-60">
        <div className="flex items-center gap-1 px-2 py-[5px] text-15 font-500 text-white-100 transition">
          Share feedback
          <DropdownIcon />
        </div>
      </button>

      <DropdownMenu.Content
        collisionPadding={12}
        sideOffset={24}
        className="w-[256px]"
      >
        {FEEDBACK_LINKS.map(({ label, href }) => (
          <DropdownMenu.Item
            key={label}
            label={label}
            external
            onSelect={() => {
              window.open(href, '_blank')
            }}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

const FeedbackSection = () => {
  return (
    <div className="flex size-full items-center justify-center">
      <div className="flex w-[256px] flex-col gap-4 rounded-16 border border-neutral-10 bg-neutral-2.5 p-4">
        <span className="text-19 font-600 text-neutral-100">
          We're building with you.
        </span>
        <div className="flex flex-col">
          {FEEDBACK_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              target="_blank"
              className="flex justify-between px-2 py-[5px] text-15 font-500 text-neutral-100 hover:text-neutral-50"
            >
              {label} <ExternalIcon />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export { FeedbackPopover, FeedbackSection }
