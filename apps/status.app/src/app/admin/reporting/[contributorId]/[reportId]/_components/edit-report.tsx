'use client'

import { useTransition } from 'react'

import { useToast } from '@status-im/components'
import { useRouter } from 'next/navigation'

import { updateReport } from '../../../_actions'
import { ReportsDateHeader } from '../../_components/reports-date-header'
import { ReportsForm } from '../../_components/reports-form'

import type { ApiOutput } from '~server/api/types'

type Props = {
  report: ApiOutput['reports']['byId']
  projects: ApiOutput['projects']['all']
}

const EditReport = (props: Props) => {
  const { report, projects } = props

  const router = useRouter()
  const toast = useToast()

  const [isPending, startTransition] = useTransition()

  return (
    <div className="w-full max-w-[462px]">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-19 font-semibold text-neutral-100">Add report</h2>
        <ReportsDateHeader size={15} startOfWeek={report.startOfWeek} />
      </div>

      <ReportsForm
        projects={projects}
        loading={isPending}
        defaultValues={{
          timeOff: report.timeOff,
          milestones: report.milestones.map(milestone => ({
            id: milestone.id,
            timeSpent: milestone.timeSpent,
          })),
        }}
        onSubmit={values => {
          try {
            startTransition(async () => {
              await updateReport({
                id: report.id,
                values: {
                  timeOff: values.timeOff,
                  milestones: values.milestones.filter(
                    milestone => milestone.timeSpent > 0
                  ),
                },
              })
              toast.positive('Report updated successfully')
              router.push(`/admin/reporting/${report.contributorId}`)
            })
          } catch (error) {
            console.error(error)
            toast.negative('Something went wrong. Please try again later.')
          }
        }}
      />
    </div>
  )
}

export { EditReport }
