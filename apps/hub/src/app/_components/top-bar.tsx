'use client'

import { FeedbackPopover } from '@status-im/status-network/components'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

import { Link } from '~/i18n/navigation'

import { ConnectButton } from './connect-button'
import { KarmaButton } from './karma-button'
import { LanguageSelector } from './language-selector'

interface TopBarProps {
  onMenuToggle: () => void
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const t = useTranslations()

  return (
    <div
      data-theme="dark"
      className="sticky inset-x-0 top-0 z-40 flex h-[56px] items-center bg-neutral-100"
    >
      <div className="flex w-full items-center justify-between px-3 lg:pr-5">
        {/* Left side - Menu button and branding */}
        <div className="flex items-center gap-2">
          <button
            onClick={onMenuToggle}
            className="rounded p-1 text-white-80 hover:bg-white-10 lg:mr-3 lg:hidden"
            aria-label={t('navigation.toggle_menu')}
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

          <div className="hidden items-center md:flex">
            {/* Status Network Logo */}
            <Link href="/">
              <Image
                src="/logo-long.svg"
                alt="Status Network Logo"
                width={210}
                height={32}
              />
            </Link>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Image
              src="/logo.svg"
              alt="Status Network Logo"
              width={42}
              height={41}
            />

            <div className="hidden flex-col items-start gap-[6px] md:flex">
              <Image
                src="/logo-text.svg"
                alt="Status Network Logo"
                width={145}
                height={15}
                className="min-w-[145px]"
              />
            </div>
          </div>
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          {/* Share Feedback */}
          <div className="hidden md:block">
            <FeedbackPopover
              labels={{
                shareFeedback: t('footer.share_feedback'),
                contactUs: t('footer.contact_us'),
                submitBug: t('footer.submit_bug'),
              }}
            />
          </div>

          {/* Karma Button */}
          <KarmaButton size="24" className="md:hidden" />
          <KarmaButton size="32" className="hidden md:flex" />

          {/* Connect Wallet Button */}
          <ConnectButton
            label={t('top_bar.connect_wallet')}
            size="32"
            className="hidden md:block"
          />
          <ConnectButton
            label={t('top_bar.connect')}
            size="24"
            className="block md:hidden"
          />

          {/* Language Selector */}
          <div className="hidden md:block">
            <LanguageSelector size="32" />
          </div>
          <div className="block md:hidden">
            <LanguageSelector size="24" />
          </div>
        </div>
      </div>
    </div>
  )
}
