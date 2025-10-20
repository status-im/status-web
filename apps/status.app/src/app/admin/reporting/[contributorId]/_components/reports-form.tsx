'use client'

import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { AddTimeOffIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useFieldArray, useForm } from 'react-hook-form'

import { AddNewButton } from '~admin/_components/add-new-button'
import { FloatingActions } from '~admin/_components/floating-actions'
import { Form } from '~components/forms/form'
import { Tooltip } from '~components/tooltip'
import { createReportSchema } from '~server/api/validation/reports'

import { ReportsDrawer } from './reports-drawer'
import { ReportsFormItem } from './reports-form-item'
import { TimeSummary } from './time-summary'

import type { ApiOutput } from '~server/api/types'
import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

export type ModifiedMilestone =
  ApiOutput['projects']['all'][0]['milestones'][0] & {
    projectName: string
    app: ApiOutput['projects']['byId']['app']
    timeSpent: number
  }

type Props = {
  projects: ApiOutput['projects']['all']
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  loading: boolean
}

type FormValues = z.infer<typeof formSchema>

const formSchema = createReportSchema.pick({
  timeOff: true,
  milestones: true,
})

const ReportsForm = (props: Props) => {
  const { projects, defaultValues, onSubmit, loading } = props

  const [timeOffVisible, setTimeOffVisible] = useState(
    () => defaultValues.timeOff > 0
  )

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onTouched',
    defaultValues,
  })

  const { fields, remove, replace } = useFieldArray({
    keyName: 'formId',
    control: form.control,
    name: 'milestones',
    rules: {
      minLength: 1,
      maxLength: 3,
    },
  })

  const values = form.watch()

  const selection = values.milestones.map(milestone => milestone.id)

  const filteredMilestones: ModifiedMilestone[] = useMemo(
    () =>
      projects.reduce((acc, project) => {
        project.milestones.forEach(milestone => {
          if (selection.includes(milestone.id)) {
            acc.push({
              ...milestone,
              id: milestone.id,
              projectName: project.name,
              app: project.app,
              timeSpent: 0,
            })
          }
        })
        return acc
      }, [] as ModifiedMilestone[]),
    [projects, selection]
  )

  const totalAllocation =
    values.milestones.reduce((acc, milestone) => acc + milestone.timeSpent, 0) +
    values.timeOff

  return (
    <div>
      <div className="flex gap-2">
        <ReportsDrawer
          title="Add project milestone"
          projects={projects}
          selection={selection}
          onSelectionChange={ids =>
            replace(ids.map(id => ({ id, timeSpent: 0 })))
          }
        >
          <AddNewButton>Add project milestones</AddNewButton>
        </ReportsDrawer>

        {!timeOffVisible && (
          <Tooltip label="Add time off" side="bottom">
            <button
              className={cx(
                'flex size-10 items-center justify-center rounded-12 border border-dashed border-neutral-30 px-[10px] py-[9px] text-center text-15 font-medium text-neutral-100',
                'active:border-customisation-blue-50/20 active:bg-customisation-blue-50/5 hover:border-neutral-40 hover:bg-neutral-2.5'
              )}
              onClick={() => setTimeOffVisible(state => !state)}
            >
              <AddTimeOffIcon />
            </button>
          </Tooltip>
        )}
      </div>

      <Form {...form} onSubmit={onSubmit} className="relative">
        <div className="mt-2 flex flex-col gap-2">
          {fields.map((field, index) => {
            const milestone = filteredMilestones.find(
              milestone => milestone.id === field.id
            )

            if (!milestone) return null

            return (
              <ReportsFormItem
                key={field.id}
                id={field.formId}
                type="milestone"
                milestone={milestone}
                name={`milestones.${index}.timeSpent`}
                onRemove={() => remove(index)}
              />
            )
          })}

          {timeOffVisible && (
            <ReportsFormItem
              type="timeOff"
              key="time-off"
              id="timeOff"
              name="timeOff"
              onRemove={() => {
                form.setValue('timeOff', 0, { shouldDirty: true })
                setTimeOffVisible(false)
              }}
            />
          )}
        </div>

        <div className="my-6 h-px w-full bg-neutral-10" />

        <TimeSummary
          milestones={filteredMilestones}
          values={values}
          allocation={totalAllocation}
        />

        {form.formState.isDirty && (
          <FloatingActions
            segment="report"
            variant="edit"
            loading={loading}
            isDisabled={loading || totalAllocation !== 100}
          />
        )}
      </Form>
    </div>
  )
}

export { ReportsForm }
export type { FormValues as ReportsFormValues }
