import { useState } from 'react'

import { DropdownMenu } from '@status-im/components'

import { DropdownIcon } from './dropdown-icon'

const FEEDBACK_LINKS = [
  {
    label: 'Contact us',
    href: 'https://statusnetwork.typeform.com/contact-us',
  },
  {
    label: 'Submit bug',
    href: 'https://github.com/status-im/status-web/issues/new?template=bug_report.md',
  },
]

const FeedbackPopover = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen}>
      <button
        type="button"
        className="flex cursor-pointer select-none items-center rounded-10 border border-neutral-70 hover:border-neutral-60"
      >
        <div className="flex items-center gap-1 px-2 py-[5px] text-15 font-500 text-white-100 transition">
          Share feedback
          <span className="text-neutral-50">
            <DropdownIcon />
          </span>
        </div>
      </button>

      <DropdownMenu.Content
        collisionPadding={12}
        sideOffset={24}
        className="w-[256px]"
        style={{ zIndex: 100 }}
      >
        {FEEDBACK_LINKS.map(({ label, href }) => (
          <DropdownMenu.Item
            key={label}
            label={label}
            external
            onSelect={() => {
              window.open(href, '_blank', 'noopener,noreferrer')
            }}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { FeedbackPopover }
