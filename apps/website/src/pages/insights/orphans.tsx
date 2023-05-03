import { Text } from '@status-im/components'

import { TableIssues } from '@/components/table-issues'
import { InsightsLayout } from '@/layouts/insights-layout'

import type { Page } from 'next'

const OrphansPage: Page = () => {
  return (
    <div className="space-y-6">
      <Text size={27} weight="semibold">
        Orphans
      </Text>

      <TableIssues />
    </div>
  )
}

OrphansPage.getLayout = InsightsLayout

export default OrphansPage
