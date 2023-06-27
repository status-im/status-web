import { Breadcrumbs, EpicOverview, TableIssues } from '@/components'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const WorkstreamDetailPage: Page = () => {
  return (
    <div>
      <div className="border-b border-neutral-10 px-5 py-3">
        <Breadcrumbs />
      </div>
      <div className="border-b border-neutral-10 px-10 py-6">
        <EpicOverview
          title="Communities protocol"
          description="Detecting keycard reader removal for the beginning of each flow"
          fullscreen
        />
      </div>
      <div className="border-b border-neutral-10 px-10 py-6">
        <div role="separator" className="-mx-6 my-6 h-px bg-neutral-10" />

        <TableIssues />
      </div>
    </div>
  )
}

WorkstreamDetailPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export default WorkstreamDetailPage
