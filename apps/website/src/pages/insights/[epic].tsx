import { EpicOverview } from '@/components/epic-overview'
import { TableIssues } from '@/components/table-issues'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const InsightsDetailPage: Page = () => {
  return (
    <>
      <EpicOverview
        title="Communities protocol"
        description="Detecting keycard reader removal for the beginning of each flow"
        fullscreen
      />

      <div role="separator" className="bg-neutral-10 -mx-6 my-6 h-px" />

      <TableIssues />
    </>
  )
}

InsightsDetailPage.getLayout = InsightsLayout

export default InsightsDetailPage
