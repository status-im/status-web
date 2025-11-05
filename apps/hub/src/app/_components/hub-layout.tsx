'use client'
import { useState } from 'react'

import { Divider, Footer } from '@status-im/status-network/components'
import { useReadContract } from 'wagmi'

import { STAKING_MANAGER } from '../_constants/address'
import { EmergencyBar } from './emergency-bar'
import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

interface HubLayoutProps {
  children: React.ReactNode
}

export function HubLayout({ children }: HubLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { data: emergencyModeEnabled } = useReadContract({
    address: STAKING_MANAGER.address,
    abi: STAKING_MANAGER.abi,
    functionName: 'emergencyModeEnabled',
    query: {
      refetchInterval: 30000,
    },
  })

  return (
    <div className="relative isolate z-10 min-h-screen w-full bg-neutral-100 px-1 pb-1">
      {/* Top Navigation Bar */}
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="relative w-full overflow-hidden rounded-20 bg-white-100">
        {Boolean(emergencyModeEnabled) && <EmergencyBar />}
        <div className="mx-auto flex h-[calc(100vh-64px-123px)] w-full max-w-[1504px] flex-row overflow-hidden lg:h-[calc(100vh-64px-50px)]">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <main className="min-w-0 flex-1 overflow-auto">{children}</main>
        </div>

        <section className="sticky z-50 overflow-visible">
          <div className="relative">
            <div className="absolute left-0 top-0 h-px w-9 bg-gradient-to-l from-[#E7EAEE] to-transparent" />
            <div className="px-10">
              <Divider variant="fullscreen" />
            </div>
            <div className="absolute right-0 top-0 h-px w-9 bg-gradient-to-r from-[#E7EAEE] to-transparent" />
          </div>
          <div className="px-0 lg:px-12">
            <Footer />
          </div>
        </section>
      </div>
    </div>
  )
}
