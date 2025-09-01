'use client'

import { Button } from '@status-im/components'
import Image from 'next/image'

import { SettingsIcon } from './icons'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <div className="sticky inset-x-0 top-0 z-50 h-[56px] bg-neutral-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and branding */}
        <div className="flex items-center gap-4">
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
          <Image
            src="/logo.svg"
            alt="Status Network Logo"
            width={210}
            height={32}
          />
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Share Feedback */}
          <div data-theme="dark">
            <Button variant="outline" size="24">
              Share feedback
            </Button>
          </div>

          {/* Connect Wallet Button */}
          <button className="flex h-[24px] items-center rounded-8 bg-purple p-2 px-4 text-13 font-medium text-white-100 transition-colors hover:bg-purple-dark">
            Connect Wallet
          </button>

          {/* Settings Button */}
          <button className="rounded p-2 text-white-80 hover:bg-white-10">
            <SettingsIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
