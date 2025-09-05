'use client'
import { useState } from 'react'

import { Divider } from '@status-im/status-network/components'

import { Sidebar } from './sidebar'
import { TopBar } from './top-bar'

interface HubLayoutProps {
  children: React.ReactNode
}

export function HubLayout({ children }: HubLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="relative isolate z-10 min-h-screen w-full bg-neutral-100 px-1 pb-1">
      {/* Top Navigation Bar */}
      <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content Area */}
      <div className="relative z-20 w-full overflow-hidden rounded-20 bg-white-100">
        <div className="flex h-[calc(100vh-64px)] w-full flex-row overflow-hidden">
          {/* Sidebar */}
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

          {/* Main Content */}
          <main className="min-w-0 flex-1 overflow-auto">{children}</main>
        </div>

        <footer className="sticky p-4 text-center text-13 text-neutral-60">
          <Divider />
          &copy; {new Date().getFullYear()} Status. All rights reserved.
        </footer>
      </div>
    </div>
  )
}
