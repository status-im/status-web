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
      mainnet: true,
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
        <button
          type="button"
          className="fixed inset-0 z-40 bg-neutral-80/50 lg:hidden"
          onClick={onClose}
          onKeyDown={e => e.key === 'Escape' && onClose()}
          aria-label="Close sidebar"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-60 transform border-r border-neutral-10 bg-white-100 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col overflow-auto pt-8">
          {/* Main Navigation */}
          <nav className="flex-1 px-4">
            <ul className="space-y-1">
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
                      className={`flex items-center gap-2 rounded-16 p-4 transition-colors ${
                        isActive
                          ? 'bg-customisation-purple-50/5 text-purple'
                          : 'text-neutral-90 hover:bg-neutral-10 hover:text-neutral-100'
                      }`}
                    >
                      <Icon className="size-5" />
                      <div className="flex items-center gap-2">
                        <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                          {item.label}
                        </span>
                        {item.mainnet && (
                          <div className="inline-flex items-center gap-1 rounded-full bg-purple px-1.5 py-0.5">
                            <span className="text-11 font-medium leading-[1.42] tracking-[-0.5%] text-white-100">
                              Mainnet
                            </span>
                          </div>
                        )}
                        {isExternal && (
                          <svg
                            className="size-5 text-neutral-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.2}
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

            {/* Separator with Title */}
            <div className="my-3">
              <div className="mb-2 px-4">
                <h3 className="text-13 font-medium leading-[1.4] tracking-[-0.3%] text-purple">
                  Tokens
                </h3>
              </div>
              <div className="h-px bg-customisation-purple-50/40"></div>
            </div>

            {/* Token Items */}
            <ul className="space-y-1">
              <li>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Swap
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M2.08 13.32l4.6 4.59m0 0l10.83-10.83m0 0l-5.83 3.73m0 0l-3.73 5.83"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Launch
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4.5 5l11 5m0 0l-5 5m5-5l-5-5"
                      />
                      <circle cx="2" cy="10" r="2.5" strokeWidth={1.5} />
                      <circle cx="13" cy="10" r="2.5" strokeWidth={1.5} />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Bridge
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M1.67 1.67l16.67 16.67m0 0l6.67 6.67m-6.67-6.67l0 10"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Mint USDZ
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
            </ul>

            {/* Separator */}
            <div className="my-3 h-px bg-customisation-purple-50/40"></div>

            {/* Bottom Section */}
            <ul className="space-y-1">
              <li>
                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M13.88 13.88l3.62 3.62m0 0l-13.33-13.33m13.33 13.33l-3.62-3.62"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Explorer
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="/governance"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M8.33 9.17l0 5.83m7.34-5.83l0 5.83m-7.34 0l7.34 0m-7.34 0l7.34 0m-7.34 0l0 5.83m7.34-5.83l0 5.83"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Governance
                    </span>
                    <div className="inline-flex items-center gap-1 rounded-full bg-neutral-20 px-1.5 py-0.5">
                      <span className="text-11 font-medium leading-[1.42] tracking-[-0.5%] text-neutral-90">
                        Upcoming
                      </span>
                    </div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="/submit-app"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
                    <svg
                      className="size-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M6.67 10l6.67 0m0 0l0 6.67m0-6.67l6.67 0"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Submit an app
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
              <li>
                <a
                  href="/docs"
                  className="flex items-center justify-between gap-2 rounded-16 p-4 text-neutral-90 transition-colors hover:bg-neutral-10 hover:text-neutral-100"
                >
                  <div className="flex items-center gap-2">
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
                        d="M3.33 1.67l13.33 16.67m0 0l6.67 0m-6.67 0l0 5.83m0-5.83l0 5.83"
                      />
                    </svg>
                    <span className="text-15 font-medium leading-[1.45] tracking-[-0.9%]">
                      Docs
                    </span>
                  </div>
                  <svg
                    className="size-5 text-neutral-90"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.2}
                      d="M7 17l9.2-9.2M17 17V7H7"
                    />
                  </svg>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}
