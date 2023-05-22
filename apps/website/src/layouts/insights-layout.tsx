import { SideMenu } from '../components/side-menu/side-menu'
import { AppLayout } from './app-layout'

import type { PageLayout } from 'next'

// Eventually this will be fetched from the API, at least the nested links
const MENU_LINKS = [
  {
    label: 'Epics',
    links: [
      {
        label: 'Overview',
        href: '/insights',
      },
      {
        label: 'Community Protocol',
        href: '/insights/community-protocol',
      },
      {
        label: 'Keycard',
        href: '/insights/keycard',
      },
      {
        label: 'Notifications Settings',
        href: '/insights/notifications-settings',
      },
      {
        label: 'Wallet',
        href: '/insights/wallet',
      },
      {
        label: 'Communities',
        href: '/insights/communities',
      },
      {
        label: 'Acitivity Center',
        href: '/insights/dependencies',
      },
    ],
  },
  {
    label: 'Orhans',
    href: '/insights/orphans',
  },
  {
    label: 'Repos',
    href: '/insights/repos',
  },
]

export const InsightsLayout: PageLayout = page => {
  return AppLayout(
    <div className="bg-white-100 relative mx-1 flex min-h-[calc(100vh-56px-4px)] rounded-3xl">
      <SideMenu data={MENU_LINKS} />
      <main className="flex-1 p-10">{page}</main>
    </div>
  )
}
