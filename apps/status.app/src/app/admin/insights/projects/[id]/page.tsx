import { api } from '~server/trpc/server'

import { EditProject } from './_components/edit-project'
import { ViewProject } from './_components/view-project'

import type { Metadata } from 'next'

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await api.projects.byId({ id: Number((await params).id) })

  return {
    title: project.name,
  }
}

type Props = {
  params: Promise<{
    id: string
  }>
}

export default async function ProjectPage({ params }: Props) {
  const { id: projectId } = await params

  const [project, epics, user] = await Promise.all([
    api.projects.byId({ id: Number(projectId) }),
    api.epics.all(),
    api.user(),
  ])

  const breadcrumbs = [
    {
      label: 'Projects',
      href: '/admin/insights/projects',
    },
    {
      label: project.name,
      href: `/admin/insights/projects/${projectId}`,
    },
  ]

  return user.canEditInsights ? (
    <EditProject project={project} epics={epics} breadcrumbs={breadcrumbs} />
  ) : (
    <ViewProject project={project} breadcrumbs={breadcrumbs} />
  )
}
