import { Tag } from '@status-im/components'

import { AdminLayoutDetailView } from '~admin/_layouts/admin-layout-detail-view'

import type { AdminLayoutDetailViewProps } from '~admin/_layouts/admin-layout-detail-view'
import type { ApiOutput } from '~server/api/types'

type Props = {
  epic: ApiOutput['epics']['byId']
  breadcrumbs: AdminLayoutDetailViewProps['breadcrumbs']
}

export const ViewEpic = (props: Props) => {
  const { epic, breadcrumbs } = props

  return (
    <AdminLayoutDetailView
      title={epic.name}
      description={epic.description}
      breadcrumbs={breadcrumbs}
    >
      <div className="inline-flex gap-3">
        {/* todo */}
        <Tag label={epic.name} color={epic.color} size="24" />
      </div>
    </AdminLayoutDetailView>
  )
}
