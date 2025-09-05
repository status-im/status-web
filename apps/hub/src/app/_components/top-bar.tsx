'use client'

import { SettingsIcon } from './icons'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  return (
    <div className="fixed inset-x-0 top-0 z-50 bg-neutral-100">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left side - Menu button and branding */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="text-white/80 hover:bg-white/10 rounded mr-3 p-1 lg:hidden"
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
          <div className="flex items-center gap-3">
            <div className="flex size-8 items-center justify-center rounded-full bg-purple">
              <span className="text-white text-15 font-semibold">S</span>
            </div>
            <div className="text-white text-15 font-medium">status.network</div>
            <div className="rounded-full bg-neutral-80 px-2 py-1">
              <span className="text-13 font-medium text-neutral-40">
                Testnet
              </span>
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-4">
          {/* Share Feedback */}
          <button className="text-white/80 hover:text-white text-15 font-medium">
            Share feedback
          </button>

          {/* Connect Wallet Button */}
          <button className="text-white rounded-16 bg-purple px-4 py-2 font-medium transition-colors hover:bg-purple-dark">
            Connect Wallet
          </button>

          {/* Settings Button */}
          <button className="text-white/80 hover:bg-white/10 rounded p-2">
            <SettingsIcon className="size-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
