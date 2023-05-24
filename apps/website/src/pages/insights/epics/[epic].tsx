import { Breadcrumbs } from '@/components'
import { EpicOverview } from '@/components/epic-overview'
import { TableIssues } from '@/components/table-issues'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const EpicsDetailPage: Page = () => {
  return (
    <div>
      <div className="border-neutral-10 border-b px-5 py-3">
        <Breadcrumbs />
      </div>
      <div className="px-10 py-6">
        <EpicOverview
          title="Communities protocol"
          description="Detecting keycard reader removal for the beginning of each flow"
          fullscreen
        />

        <div role="separator" className="bg-neutral-10 -mx-6 my-6 h-px" />

        <TableIssues />
      </div>
    </div>
  )
}

EpicsDetailPage.getLayout = InsightsLayout

export default EpicsDetailPage
