import { Text } from '@status-im/components'

import { Layout } from '.'
import { TableIssues } from './[epic]'

export default function OrphansPage() {
  return (
    <Layout>
      <div className="space-y-6">
        <Text size={27} weight="semibold">
          Orphans
        </Text>

        <TableIssues />
      </div>
    </Layout>
  )
}
