import { Breadcrumbs, EpicOverview, TableIssues } from '@/components'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const WorkstreamDetailPage: Page = () => {
  return (
    <div>
      <div className="border-neutral-10 border-b px-5 py-3">
        <Breadcrumbs />
      </div>
      <div className="border-neutral-10 border-b px-10 py-6">
        <EpicOverview
          title="Communities protocol"
          description="Detecting keycard reader removal for the beginning of each flow"
          fullscreen
        />
      </div>
      <div className="border-neutral-10 border-b px-10 py-6">
        <TableIssues />
      </div>
    </div>
  )
}

WorkstreamDetailPage.getLayout = InsightsLayout

export default WorkstreamDetailPage
