'use client'

import {
  BridgeIcon,
  // DepositIcon,
  DiscoverIcon,
  DocsIcon,
  ExplorerIcon,
  GovernanceIcon,
  HomeIcon,
  KarmaIcon,
  StakeIcon,
  SubmitAppIcon,
} from './icons'
import { LinkItem } from './link-item'

const NAV_LINKS = [
  { id: 'dashboard', label: 'Home', icon: HomeIcon, href: '/dashboard' },
  // {
  //   id: 'deposit',
  //   label: 'Deposit',
  //   icon: DepositIcon,
  //   href: '/deposit',
  //   tag: 'Mainnet',
  // },
  { id: 'discover', label: 'Discover', icon: DiscoverIcon, href: '/discover' },
  { id: 'stake', label: 'Stake', icon: StakeIcon, href: '/stake' },
  { id: 'karma', label: 'Karma', icon: KarmaIcon, href: '/karma' },
]

const TOKENS_LINKS = [
  {
    id: 'bridge',
    label: 'Bridge',
    icon: BridgeIcon,
    href: 'https://bridge.status.network/',
  },
]

const OTHER_LINKS = [
  {
    id: 'explorer',
    label: 'Explorer',
    icon: ExplorerIcon,
    href: 'https://sepoliascan.status.network/',
  },
  {
    id: 'governance',
    label: 'Governance',
    icon: GovernanceIcon,
    href: '/governance',
  },
  {
    id: 'submit-app',
    label: 'Submit an app',
    icon: SubmitAppIcon,
    href: 'https://statusnetwork.typeform.com/builder',
  },
  {
    id: 'docs',
    label: 'Docs',
    icon: DocsIcon,
    href: 'https://docs.status.network/',
  },
]

type Props = {
  isOpen: boolean
  onClose: () => void
}

const Sidebar = (props: Props) => {
  const { isOpen, onClose } = props

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          className="fixed inset-0 z-50 bg-neutral-80/50 lg:hidden"
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
        <div className="flex h-full flex-col overflow-auto py-8">
          {/* Main Navigation */}
          <nav className="flex-1 px-6">
            <ul className="space-y-1">
              {NAV_LINKS.map(item => {
                return <LinkItem key={item.id} {...item} />
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
              {TOKENS_LINKS.map(item => {
                return <LinkItem key={item.id} {...item} />
              })}
            </ul>

            {/* Separator */}
            <div className="my-3 h-px bg-customisation-purple-50/40"></div>

            {/* Bottom Section */}
            <ul className="space-y-1">
              {OTHER_LINKS.map(item => {
                return <LinkItem key={item.id} {...item} />
              })}
            </ul>
          </nav>
        </div>
      </div>
    </>
  )
}

export { Sidebar }
