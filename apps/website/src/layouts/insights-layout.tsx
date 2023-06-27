import { useGetEpicMenuLinksQuery } from '@/lib/graphql/generated/hooks'

import { SideBar } from '../components'
import { AppLayout } from './app-layout'

import type { ReactNode } from 'react'

// TODO: find away to avoid export this query because of the warning of const not being used
export const GET_EPIC_LINKS = /* GraphQL */ `
  query getEpicMenuLinks {
    gh_epics(where: { status: { _eq: "In Progress" } }) {
      epic_name
      status
    }
  }
`

const STATIC_LINKS = [
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
  children: ReactNode
}

export const InsightsLayout: React.FC<InsightsLayoutProps> = ({ children }) => {
  const { data, isLoading } = useGetEpicMenuLinksQuery()

  const epicLinks =
    data?.gh_epics.map(epic => {
      return {
        label: epic.epic_name || '',
        href: `/insights/epics/${epic.epic_name}`,
      }
    }) || []

  const links = [
    {
      label: 'Epics',
      links: [
        {
          label: 'Overview',
          href: '/insights/epics',
        },
        ...epicLinks,
      ],
    },
    ...STATIC_LINKS,
  ]

  return (
    <AppLayout hasPreFooter={false}>
      <div className="relative mx-1 flex min-h-[calc(100vh-56px-4px)] w-full rounded-3xl bg-white-100">
        {<SideBar data={links} isLoading={isLoading} />}
        <main className="flex-1">{children}</main>
      </div>
    </AppLayout>
  )
}
