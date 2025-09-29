import { api } from '~server/trpc/server'

import { DynamicLayout } from '../../_components/dynamic-layout'
import { WorkstreamsList } from './_components/workstreams-list'

type Props = {
  children: React.ReactNode
}

export const dynamic = 'force-dynamic'

export default async function WorkstreamsLayout(props: Props) {
  const { children } = props

  const [workstreams, projects] = await Promise.all([
    api.workstreams.all(),
    api.projects.all(),
  ])

  return (
    <DynamicLayout
      leftView={
        <WorkstreamsList workstreams={workstreams} projects={projects} />
      }
      rightView={children}
    />
  )
}
