'use client'

import { Avatar } from '@status-im/components'
import { DoneIcon, NotStartedIcon } from '@status-im/icons/16'
import { usePathname } from 'next/navigation'

import { ReportsListItem } from './reports-list-item'

import type { ApiOutput } from '~server/api/types'

type Props = {
  reports: ApiOutput['reports']['byContributorId']
  contributorId: string
}

const ReportsList = (props: Props) => {
  const { reports, contributorId } = props
  const pathname = usePathname()

  return (
    <main>
      <div className="py-3 text-13 font-medium">
        <Avatar
          type="user"
          size="48"
          src={reports.contributor.photoUrl}
          name={reports.contributor.name}
        />
        <div className="mt-3 flex items-end gap-1">
          <div className="text-19 font-semibold text-neutral-100">
            {reports.contributor.name}
            {reports.contributor.customGitHubusername && (
              <span className="ml-1 text-15 font-regular text-neutral-50">
                {reports.contributor.customGitHubusername}
              </span>
            )}
          </div>
        </div>
        <span className="text-15 font-regular text-neutral-100">
          {reports.contributor.jobTitle}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {reports.outstanding.length > 0 && (
          <>
            <div className="mb-2 mt-5 flex items-center gap-1 text-13 font-medium text-neutral-100">
              <NotStartedIcon className="text-neutral-50" /> Outstanding
            </div>

            <ul className="flex flex-col gap-2">
              {reports.outstanding.map(({ startOfWeek }) => {
                const reportingRoute = `/admin/reporting/${contributorId}/new?startOfWeek=${startOfWeek.getTime()}`

                return (
                  <ReportsListItem
                    key={startOfWeek.getTime()}
                    startOfWeek={startOfWeek}
                    href={reportingRoute}
                    aria-selected={pathname === reportingRoute}
                    disabled={pathname === reportingRoute}
                  />
                )
              })}
            </ul>
          </>
        )}

        {reports.closed.length > 0 && (
          <>
            <div className="mb-2 mt-5 flex items-center gap-1 text-13 font-medium text-success-50">
              <DoneIcon /> Closed
            </div>
            <ul className="flex flex-col gap-2">
              {Array.isArray(reports.closed) &&
                reports.closed.map(
                  ({ startOfWeek, id, milestones, timeOff }) => {
                    const reportingRoute = `/admin/reporting/${contributorId}/${id}`

                    return (
                      <ReportsListItem
                        key={id}
                        href={reportingRoute}
                        isDone
                        milestones={milestones}
                        timeOff={timeOff}
                        startOfWeek={startOfWeek}
                        aria-selected={pathname === reportingRoute}
                        disabled={pathname === reportingRoute}
                      />
                    )
                  }
                )}
            </ul>
          </>
        )}
      </div>
    </main>
  )
}

export { ReportsList }
