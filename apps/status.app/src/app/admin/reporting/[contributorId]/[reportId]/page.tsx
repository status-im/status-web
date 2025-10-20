import { api } from '~server/trpc/server'

import { EditReport } from './_components/edit-report'

type Props = {
  params: Promise<{
    reportId: string
  }>
}

export default async function ReportPage(props: Props) {
  const { params } = props

  const [report, projects] = await Promise.all([
    api.reports.byId({ id: Number((await params).reportId) }),
    api.projects.all(),
  ])

  return <EditReport projects={projects} report={report} />
}
