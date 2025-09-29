'use client'

import { useEffect, useState } from 'react'

import { Button } from '@status-im/components'
import { DeleteIcon } from '@status-im/icons/12'

import { AddNewButton } from '~admin/_components/add-new-button'
import { AlertDialog } from '~admin/_components/alert-dialog'
import { DataItem } from '~admin/_components/data-item'
import { shortDate } from '~admin/_utils'
import { MilestonesStatusGroupList } from '~admin/insights/_components/milestones-status-group-list'
import { StatusGroupHeader } from '~admin/insights/_components/status-group-header'

import {
  removeReleaseMilestone,
  updateReleaseMilestones,
} from '../../../_actions'
import { AddMilestonesDrawer } from './add-milestones-drawer'

import type { ApiOutput } from '~server/api/types'

type Props = {
  release: ApiOutput['releases']['byId']
  projects: ApiOutput['projects']['all']
  user: ApiOutput['user']
}

export const ReleaseDetail = (props: Props) => {
  const { release, projects, user } = props

  const [milestoneIds, setMilestoneIds] = useState<number[]>(() =>
    release.milestones.map(p => p.id)
  )

  useEffect(() => {
    setMilestoneIds(release.milestones.map(p => p.id))
  }, [release.milestones])

  return (
    <>
      <div className="grid grid-cols-3 gap-3">
        <DataItem label="Platform" className="col-span-2">
          <div className="flex flex-row items-center gap-2">
            {/* <span className="text-15">{release.platform.emoji}</span> */}
            <span className="capitalize">{release.platform}</span>
          </div>
        </DataItem>
        {release.dueOn && (
          <DataItem label="Due date" className="col-span-1">
            {shortDate(new Date(release.dueOn))}
          </DataItem>
        )}
      </div>

      {user.canEditInsights && (
        <StatusGroupHeader
          title="Milestones"
          description="Add, view, and manage milestones."
        >
          <AddMilestonesDrawer
            projects={projects}
            selection={milestoneIds}
            onSelectionChange={setMilestoneIds}
            onSubmit={async () =>
              await updateReleaseMilestones({
                releaseId: release.id,
                milestoneIds,
              })
            }
          >
            <AddNewButton>Add project milestones</AddNewButton>
          </AddMilestonesDrawer>
        </StatusGroupHeader>
      )}

      <MilestonesStatusGroupList
        milestones={release.milestones}
        cardFooterType="project"
        cardAction={milestone => (
          <AlertDialog
            title="Remove milestone"
            onConfirm={async () => {
              await removeReleaseMilestone({
                releaseId: release.id,
                milestoneId: milestone.id,
              })
            }}
          >
            <Button
              size="24"
              variant="outline"
              icon={<DeleteIcon />}
              aria-label="Remove milestone"
            />
          </AlertDialog>
        )}
      />
    </>
  )
}
