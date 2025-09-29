'use client'

import { useTransition } from 'react'

import { useToast } from '@status-im/components'
import { notFound, useRouter, useSearchParams } from 'next/navigation'

import { createReport } from '~admin/reporting/_actions'

import { ReportsDateHeader } from '../../_components/reports-date-header'
import { ReportsForm } from '../../_components/reports-form'

import type { ApiOutput } from '~server/api/types'

type Props = {
  projects: ApiOutput['projects']['all']
  contributorId: string
  outstanding: Date[]
}

const CreateReport = (props: Props) => {
  const { projects, contributorId, outstanding } = props
  const searchParams = useSearchParams()

  const router = useRouter()
  const toast = useToast()
  const [isPending, startTransition] = useTransition()

  const startOfWeekParam = searchParams?.get('startOfWeek')

  if (!startOfWeekParam) {
    return notFound()
  }

  const startOfWeek = outstanding.find(
    date => date.getTime().toString() === startOfWeekParam
  )

  if (!startOfWeek) {
    return notFound()
  }

  return (
    <div className="w-full max-w-[462px]">
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-19 font-semibold text-neutral-100">Add report</h2>
        <ReportsDateHeader size={15} startOfWeek={startOfWeek} />
      </div>
      <ReportsForm
        projects={projects}
        loading={isPending}
        defaultValues={{
          timeOff: 0,
          milestones: [],
        }}
        onSubmit={async values => {
          try {
            startTransition(async () => {
              await createReport({
                contributorId,
                startOfWeek: startOfWeek.toISOString(),
                timeOff: values.timeOff,
                milestones: values.milestones.filter(
                  milestone => milestone.timeSpent > 0
                ),
              })
              toast.positive('Report created successfully')
              router.push(`/admin/reporting/${contributorId}`)
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

export { CreateReport }
