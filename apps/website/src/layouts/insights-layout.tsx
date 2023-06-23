import { useQuery } from '@tanstack/react-query'

import { fetchQueryFromHasura } from '@/pages/api/hasura'

import { SideBar } from '../components'
import { AppLayout } from './app-layout'

import type { ReactNode } from 'react'

const QUERY = `
  query getEpicMenuLinks {
    gh_epics {
      epic_name
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

type Epic = {
  epic_name: string
}

export const InsightsLayout: React.FC<InsightsLayoutProps> = ({ children }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['getEpicMenuLinks'], // Add repository and epicName to queryKey
    queryFn: () => fetchQueryFromHasura(QUERY), // Pass repository and epicName to getQuery function
  })

  const epicLinks =
    data?.data?.gh_epics.map((epic: Epic) => {
      return {
        label: epic.epic_name,
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
