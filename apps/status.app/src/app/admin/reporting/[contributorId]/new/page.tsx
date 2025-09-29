import { api } from '~server/trpc/server'

import { CreateReport } from './_components/create-report'

type Props = {
  params: Promise<{
    contributorId: string
  }>
}

export default async function NewReport(props: Props) {
  const { params } = props

  const { contributorId } = await params
  const [projects, summary] = await Promise.all([
    api.projects.all(),
    api.reports.summary(),
  ])

  const outstanding =
    summary.find(summary => summary.contributorId === contributorId)
      ?.outstanding ?? []

  return (
    <CreateReport
      projects={projects}
      contributorId={contributorId}
      outstanding={outstanding}
    />
  )
}
