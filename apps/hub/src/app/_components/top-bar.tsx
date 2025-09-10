'use client'

import { Button, IconButton, Tag } from '@status-im/components'
import { SettingsIcon } from '@status-im/icons/20'
import Image from 'next/image'
import Link from 'next/link'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <div
      data-theme="dark"
      className="sticky inset-x-0 top-0 z-40 flex h-[56px] items-center bg-neutral-100"
    >
      <div className="flex w-full items-center justify-between px-6 pl-4">
        {/* Left side - Menu button and branding */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuToggle}
            className="rounded mr-3 p-1 text-white-80 hover:bg-white-10 lg:hidden"
            aria-label="Toggle menu"
          >
            <svg
              className="size-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Status Network Logo */}
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="Status Network Logo"
              width={210}
              height={32}
            />
          </Link>

          <Tag size="24" label="Testnet" />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Share Feedback */}
          <div>
            <Button variant="outline" size="24">
              Share feedback
            </Button>
          </div>

          {/* Connect Wallet Button */}
          <button className="flex h-[24px] items-center rounded-8 bg-purple p-2 px-4 text-13 font-medium text-white-100 transition-colors hover:bg-purple-dark">
            Connect Wallet
          </button>

          {/* Settings Button */}
          <IconButton variant="ghost" icon={<SettingsIcon />} />
        </div>
      </div>
    </div>
  )
}
