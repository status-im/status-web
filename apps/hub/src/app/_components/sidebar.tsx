'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon } from './icons'

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  const navigationItems = [
    { id: 'dashboard', label: 'Home', icon: HomeIcon, href: '/dashboard' },
    {
      id: 'deposit',
      label: 'Deposit',
      icon: HomeIcon,
      href: 'https://example.com',
      external: true,
    },
    { id: 'discover', label: 'Discover', icon: HomeIcon, href: '/discover' },
    { id: 'stake', label: 'Stake', icon: HomeIcon, href: '/stake' },
    { id: 'karma', label: 'Karma', icon: HomeIcon, href: '/karma' },
  ]

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/'
    }
    return pathname === href
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="bg-black/50 fixed inset-0 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-neutral-10 bg-white-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col p-6">
          {/* Logo */}
          <div className="mb-8 flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-purple">
              <span className="text-white text-xl font-bold">S</span>
            </div>
            <div className="text-15 font-medium text-neutral-90">
              Status Network
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1">
            <ul className="space-y-2">
              {navigationItems.map(item => {
                const Icon = item.icon
                const isActive = isActiveRoute(item.href)
                const isExternal = item.external || item.href.startsWith('http')

                return (
                  <li key={item.id}>
                    <a
                      href={item.href}
                      target={isExternal ? '_blank' : undefined}
                      rel={isExternal ? 'noopener noreferrer' : undefined}
                      className={`flex items-center gap-3 rounded-16 px-3 py-2 transition-colors ${
                        isActive
                          ? 'text-white bg-purple'
                          : 'text-neutral-90 hover:bg-neutral-10 hover:text-neutral-100'
                      }`}
                    >
                      <Icon className="size-5" />
                      <div className="flex items-center gap-2">
                        <span>{item.label}</span>
                        {item.id === 'deposit' && (
                          <div className="bg-purple/20 inline-flex items-center gap-1 rounded-full px-1.5 py-0.5">
                            <span className="text-11 font-medium text-purple">
                              Mainnet
                            </span>
                          </div>
                        )}
                        {isExternal && (
                          <svg
                            className="size-4 text-neutral-60"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 17l9.2-9.2M17 17V7H7"
                            />
                          </svg>
                        )}
                      </div>
                    </a>
                  </li>
                )
              })}
            </ul>

            {/* Separator */}
            <div className="border-purple/20 my-6 border-t"></div>

            {/* Native Apps */}
            <div className="mb-6">
              <h3 className="text-purple/60 mb-4 text-15 font-semibold">
                Native apps
              </h3>
              <ul className="space-y-2">
                <li>
                  <a
                    href="/bridge"
                    className="flex items-center justify-between rounded-16 px-3 py-2 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                        />
                      </svg>
                      <span>Bridge</span>
                    </div>
                    <svg
                      className="size-4 text-neutral-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="/swap"
                    className="flex items-center justify-between rounded-16 px-3 py-2 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                      <span>Swap</span>
                    </div>
                    <svg
                      className="size-4 text-neutral-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="/explorer"
                    className="flex items-center justify-between rounded-16 px-3 py-2 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                      </svg>
                      <span>Explorer</span>
                    </div>
                    <svg
                      className="size-4 text-neutral-60"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 17l9.2-9.2M17 17V7H7"
                      />
                    </svg>
                  </a>
                </li>
                <li>
                  <a
                    href="/governance"
                    className="flex items-center justify-between rounded-16 px-3 py-2 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                  >
                    <div className="flex items-center gap-3">
                      <svg
                        className="size-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                      <span>Governance</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center gap-1 rounded-full bg-neutral-20 px-1.5 py-0.5">
                        <span className="text-11 font-medium text-neutral-90">
                          Upcoming
                        </span>
                      </div>
                      <svg
                        className="size-4 text-neutral-60"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 17l9.2-9.2M17 17V7H7"
                        />
                      </svg>
                    </div>
                  </a>
                </li>
              </ul>
            </div>

            {/* Separator */}
            <div className="border-purple/20 my-6 border-t"></div>

            {/* Bottom Section */}
            <div className="space-y-2">
              <div className="relative">
                <a
                  href="/submit-app"
                  className="flex items-center justify-between rounded-16 border border-purple px-3 py-2 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                    <span>Submit an app</span>
                  </div>
                  <svg
                    className="size-4 text-neutral-60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </div>

              <a
                href="/docs"
                className="flex items-center justify-between rounded-16 px-3 py-2 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="size-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Docs</span>
                </div>
                <svg
                  className="size-4 text-neutral-60"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 17l9.2-9.2M17 17V7H7"
                  />
                </svg>
              </a>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
