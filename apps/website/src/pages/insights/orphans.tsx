import { Text } from '@status-im/components'

import { TableIssues } from '@/components'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const OrphansPage: Page = () => {
  return (
    <div className="space-y-6 p-10">
      <Text size={27} weight="semibold">
        Orphans
      </Text>

      <TableIssues />
    </div>
  )
}

OrphansPage.getLayout = function getLayout(page) {
  return <InsightsLayout>{page}</InsightsLayout>
}

export default OrphansPage
