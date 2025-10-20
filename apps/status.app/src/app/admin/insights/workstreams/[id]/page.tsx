import { api } from '~server/trpc/server'

import { EditWorkstream } from './_components/edit-workstream'
import { ViewWorkstream } from './_components/view-workstream'

import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const workstream = await api.workstreams.byId({
    id: Number((await params).id),
  })

  return {
    title: workstream.name,
  }
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function WorkstreamPage({ params }: Props) {
  const { id: workstreamId } = await params

  const [workstream, projects, user] = await Promise.all([
    api.workstreams.byId({ id: Number(workstreamId) }),
    api.projects.all(),
    api.user(),
  ])

  const breadcrumbs = [
    {
      label: 'Workstreams',
      href: '/admin/insights/workstreams',
    },
    {
      label: workstream.name,
      href: `/admin/insights/workstreams/${workstreamId}`,
    },
  ]

  return user.canEditInsights ? (
    <EditWorkstream
      workstream={workstream}
      projects={projects}
      breadcrumbs={breadcrumbs}
    />
  ) : (
    <ViewWorkstream workstream={workstream} breadcrumbs={breadcrumbs} />
  )
}
