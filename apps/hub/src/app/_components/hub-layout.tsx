'use client'

import { useState } from 'react'

import { ToastContainer } from '@status-im/components'
import { Divider, Footer } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'
import { useReadContract } from 'wagmi'

import { STAKING_MANAGER } from '~constants/index'
import { CACHE_CONFIG } from '~constants/staking'

import { EmergencyBar } from './emergency-bar'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

interface HubLayoutProps {
  children: React.ReactNode
}

export function HubLayout({ children }: HubLayoutProps) {
  const t = useTranslations()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { data: emergencyModeEnabled } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'emergencyModeEnabled',
    query: {
      refetchInterval: CACHE_CONFIG.EMERGENCY_MODE_REFETCH_INTERVAL,
    },
  })

  return (
    <div className="relative isolate z-10 min-h-screen w-full bg-neutral-100 px-1 pb-1">
      {/* Top Navigation Bar */}
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="relative w-full rounded-20 bg-white-100 lg:overflow-hidden lg:px-6">
        {Boolean(emergencyModeEnabled) && <EmergencyBar />}
        <div className="mx-auto flex w-full max-w-[1504px] flex-row gap-12 lg:h-[calc(100vh-64px-50px)] lg:overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <main className="min-w-0 flex-1 lg:overflow-auto">{children}</main>
        </div>

        <section className="z-30 overflow-visible lg:sticky lg:z-50">
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
      <ToastContainer />
    </div>
  )
}
