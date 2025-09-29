'use client'

import { Avatar } from '@status-im/components'

import { DataItem } from '~admin/_components/data-item'
import { AdminLayoutDetailView } from '~admin/_layouts/admin-layout-detail-view'
import { shortDate } from '~admin/_utils'

import { ProjectsStatusGroupList } from '../../_components/projects-status-group-list'

import type { AdminLayoutDetailViewProps } from '~admin/_layouts/admin-layout-detail-view'
import type { ApiOutput } from '~server/api/types'

type Props = {
  workstream: ApiOutput['workstreams']['byId']
  breadcrumbs: AdminLayoutDetailViewProps['breadcrumbs']
}

const ViewWorkstream = (props: Props) => {
  const { workstream, breadcrumbs } = props

  return (
    <AdminLayoutDetailView
      title={workstream.name}
      description={workstream.description}
      avatar={
        <Avatar
          type="channel"
          size="32"
          name={workstream.name}
          emoji={workstream.emoji}
        />
      }
      breadcrumbs={breadcrumbs}
    >
      <div className="grid grid-cols-3 gap-3">
        <DataItem label="Date" className="col-span-1">
          {shortDate(new Date(workstream.createdAt))}
        </DataItem>
        {/* <DataItem label="Added by" className="col-span-2">
              <Avatar
                name={workstream.addedBy}
                type="user"
                size={16}
                backgroundColor="$blue-50"
              />
              {workstream.addedBy}
            </DataItem> */}
      </div>

      <ProjectsStatusGroupList projects={workstream.projects} />
    </AdminLayoutDetailView>
  )
}

export { ViewWorkstream }
