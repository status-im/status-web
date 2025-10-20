import { api } from '~server/trpc/server'

import { DynamicLayout } from '../../_components/dynamic-layout'
import { ReportsList } from './_components/reports-list'

export const dynamic = 'force-dynamic'

type Props = {
  children: React.ReactNode
  params: Promise<{
    contributorId: string
  }>
}

export default async function ReportsLayout(props: Props) {
  const { children, params } = props

  const { contributorId } = await params

  const reports = await api.reports.byContributorId({
    contributorId,
  })

  return (
    <DynamicLayout
      leftView={<ReportsList reports={reports} contributorId={contributorId} />}
      rightView={children}
    />
  )
}
