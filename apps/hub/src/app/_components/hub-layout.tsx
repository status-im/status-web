'use client'

import { useState } from 'react'

import { Divider, Footer } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'

import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

interface HubLayoutProps {
  children: React.ReactNode
  showSidebar?: boolean
}

export function HubLayout({ children, showSidebar = true }: HubLayoutProps) {
  const t = useTranslations()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative isolate z-10 flex min-h-dvh w-full flex-col bg-neutral-100 px-1 pb-1">
      <TopBar
        onMenuToggle={
          showSidebar ? () => setSidebarOpen(!sidebarOpen) : undefined
        }
      />

      <div
        className={
          showSidebar
            ? 'relative min-h-0 w-full flex-1 rounded-20 bg-white-100 lg:overflow-hidden lg:px-6'
            : 'relative grid min-h-0 w-full flex-1 grid-rows-[1fr_auto] rounded-20 bg-white-100 lg:px-6'
        }
      >
        {showSidebar ? (
          <div className="mx-auto flex w-full max-w-[1504px] flex-row gap-12 lg:h-[calc(100vh-64px-50px)] lg:overflow-hidden">
            <Sidebar
              isOpen={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="min-w-0 flex-1 lg:overflow-auto">{children}</main>
          </div>
        ) : (
          <main className="flex min-h-0 w-full items-center justify-center px-5">
            {children}
          </main>
        )}

        <section
          className={
            showSidebar
              ? 'z-30 overflow-visible lg:sticky lg:z-50'
              : 'z-30 shrink-0 overflow-visible'
          }
        >
          <div className="relative">
            <div className="absolute left-0 top-0 h-px w-9 bg-gradient-to-l from-[#E7EAEE] to-[transparent]" />
            <div className="px-10">
              <Divider variant="fullscreen" />
            </div>
            <div className="absolute right-0 top-0 h-px w-9 bg-gradient-to-r from-[#E7EAEE] to-[transparent]" />
          </div>
          <div className="px-0 lg:px-12">
            <Footer
              labels={{
                termsOfUse: t('footer.terms_of_use'),
                privacyPolicy: t('footer.privacy_policy'),
                brandAssets: t('footer.brand_assets'),
                preDepositDisclaimer: t('footer.pre_deposit_disclaimer'),
              }}
            />
          </div>
        </section>
      </div>
    </div>
  )
}
