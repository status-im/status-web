import { api } from '~server/trpc/server'

import { DynamicLayout } from '../../_components/dynamic-layout'
import { ProjectsList } from './_components/projects-list'

type Props = {
  children: React.ReactNode
}

export const dynamic = 'force-dynamic'

export default async function ProjectsLayout(props: Props) {
  const { children } = props

  const projects = await api.projects.all()

  const isAdmin = true

  return (
    <DynamicLayout
      leftView={<ProjectsList projects={projects} isAdmin={isAdmin} />}
      rightView={children}
    />
  )
}
