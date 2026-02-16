'use client'

import { useEffect, useState } from 'react'

import { DropdownMenu } from '@status-im/components'

const ConnectedDApps = () => {
  const [origins, setOrigins] = useState<string[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const load = () => {
      chrome.storage.session
        .get('connectedOrigins')
        .then(result => {
          setOrigins(result.connectedOrigins || [])
        })
        .catch(() => {})
    }

    load()

    const listener = (
      changes: Record<string, chrome.storage.StorageChange>,
      area: string,
    ) => {
      if (area === 'session' && changes.connectedOrigins) {
        setOrigins(changes.connectedOrigins.newValue || [])
      }
    }

    chrome.storage.onChanged.addListener(listener)
    return () => chrome.storage.onChanged.removeListener(listener)
  }, [])

  if (origins.length === 0) {
    return null
  }

  return (
    <DropdownMenu.Root onOpenChange={setIsOpen} open={isOpen}>
      <button className="flex cursor-pointer items-center gap-1.5 rounded-10 border border-neutral-70 px-2 py-[5px] hover:border-neutral-60">
        <span className="size-2 rounded-full bg-success-50" />
        <span className="text-13 font-500 text-white-100">
          {origins.length} {origins.length === 1 ? 'dApp' : 'dApps'}
        </span>
      </button>

      <DropdownMenu.Content
        collisionPadding={12}
        sideOffset={24}
        className="w-[256px]"
      >
        {origins.map(origin => (
          <DropdownMenu.Item
            key={origin}
            label={formatOrigin(origin)}
            onSelect={() => {
              window.open(origin, '_blank')
            }}
          />
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

function formatOrigin(origin: string): string {
  try {
    return new URL(origin).hostname
  } catch {
    return origin
  }
}

export { ConnectedDApps }
