import { api } from '~server/trpc/server'

import { EditEpic } from './_components/edit-epic'
import { ViewEpic } from './_components/view-epic'

import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const epic = await api.epics.byId({ id: Number((await params).id) })

  return {
    title: epic.name,
  }
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function EpicPage({ params }: Props) {
  const { id: epicId } = await params

  const [epic, user] = await Promise.all([
    api.epics.byId({ id: Number(epicId) }),
    api.user(),
  ])

  const breadcrumbs = [
    {
      label: 'Epics',
      href: '/admin/insights/epics',
    },
    {
      label: epic.name,
      href: `/admin/insights/epics/${epicId}`,
    },
  ]

  return user.canEditInsights ? (
    <EditEpic epic={epic} breadcrumbs={breadcrumbs} />
  ) : (
    <ViewEpic epic={epic} breadcrumbs={breadcrumbs} />
  )
}
