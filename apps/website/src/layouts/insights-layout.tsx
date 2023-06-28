import { SidebarMenu } from '../components/sidebar-menu'
import { AppLayout } from './app-layout'

// Eventually this will be fetched from the API, at least the nested links
const MENU_LINKS = [
  {
    label: 'Epics',
    links: [
      {
        label: 'Overview',
        href: '/insights/epics',
      },
      {
        label: 'Community Protocol',
        href: '/insights/epics/1',
      },
      {
        label: 'Keycard',
        href: '/insights/epics/keycard',
      },
      {
        label: 'Notifications Settings',
        href: '/insights/epics/notifications-settings',
      },
      {
        label: 'Wallet',
        href: '/insights/epics/wallet',
      },
      {
        label: 'Communities',
        href: '/insights/epics/communities',
      },
      {
        label: 'Acitivity Center',
        href: '/insights/epics/activity-center',
      },
    ],
  },
  {
    label: 'Workstreams',
    links: [
      {
        label: 'Overview',
        href: '/insights/workstreams',
      },
      {
        label: 'Community Protocol 2',
        href: '/insights/workstreams/community-protocol-2',
      },
      {
        label: 'Keycard 2',
        href: '/insights/workstreams/keycard-2',
      },
      {
        label: 'Notifications Settings 2',
        href: '/insights/workstreams/notifications-settings-2',
      },
      {
        label: 'Wallet 2',
        href: '/insights/workstreams/wallet-2',
      },
      {
        label: 'Communities 2',
        href: '/insights/workstreams/communities-2',
      },
      {
        label: 'Acitivity Center 2',
        href: '/insights/workstreams/activity-center-2',
      },
    ],
  },
  {
    label: 'Orphans',
    href: '/insights/orphans',
  },
  {
    label: 'Repos',
    href: '/insights/repos',
  },
]

interface InsightsLayoutProps {
  children: React.ReactNode
}

export const InsightsLayout: React.FC<InsightsLayoutProps> = ({ children }) => {
  return (
    <AppLayout hasPreFooter={false}>
      <div className="relative mx-1 flex min-h-[calc(100vh-56px-4px)] w-full rounded-3xl bg-white-100">
        <SidebarMenu items={MENU_LINKS} />
        <main className="flex-1">{children}</main>
      </div>
    </AppLayout>
  )
}
