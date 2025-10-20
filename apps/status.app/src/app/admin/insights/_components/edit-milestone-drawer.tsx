'use client'

import { useState, useTransition } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button, useToast } from '@status-im/components'
import { DeleteIcon, LoadingIcon } from '@status-im/icons/20'
import { useForm } from 'react-hook-form'

import * as Drawer from '~admin/_components/drawer'
import { EpicPicker } from '~admin/_components/epic-picker'
import { Form } from '~components/forms/form'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { milestoneSchema } from '~server/api/validation/milestones'

import { AlertDialog } from '../../_components/alert-dialog'
import { deleteProjectMilestone } from '../projects/_actions'

import type { ApiOutput } from '~server/api/types'
import type { SubmitHandler } from 'react-hook-form'
import type { z } from 'zod'

type Props = {
  title: string
  epics: ApiOutput['epics']['all']
  defaultValues: FormValues
  onSubmit: SubmitHandler<FormValues>
  successMessage: string
  children: React.ReactElement
  milestoneId?: number
}

type FormValues = z.infer<typeof milestoneSchema>

const EditMilestoneDrawer = (props: Props) => {
  const {
    title,
    epics,
    defaultValues,
    onSubmit,
    successMessage,
    children,
    milestoneId,
  } = props

  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const toast = useToast()

  const handleSubmit: SubmitHandler<FormValues> = async data => {
    try {
      startTransition(async () => {
        await onSubmit(data)
        setOpen(false)
        toast.positive(successMessage)
      })
    } catch (error) {
      console.error(error)
      toast.negative('Something went wrong. Please try again later.')
    }
  }

  return (
    <Drawer.Root modal open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Drawer.Title>{title}</Drawer.Title>
        </Drawer.Header>
        <MilestoneForm
          defaultValues={defaultValues}
          epics={epics}
          milestoneId={milestoneId}
          onSubmit={handleSubmit}
          loading={isPending}
        />
      </Drawer.Content>
    </Drawer.Root>
  )
}

const MilestoneForm = (
  props: Omit<Props, 'children' | 'title' | 'successMessage'> & {
    loading: boolean
  }
) => {
  const { epics, defaultValues, onSubmit, milestoneId, loading } = props

  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(milestoneSchema),
    mode: 'onTouched',
    defaultValues,
  })

  return (
    <Form {...form} onSubmit={onSubmit} className="flex flex-1 flex-col">
      <Drawer.Body>
        <div className="flex flex-1 flex-col gap-4">
          <TextInput
            label="Name"
            name="name"
            placeholder="Milestone name"
            maxLength={30}
          />
          <TextArea
            label="Description"
            name="description"
            placeholder="Set a milestone description"
            rows={6}
          />
          <EpicPicker name="epicIds" epics={epics} />
        </div>
      </Drawer.Body>
      <Drawer.Footer>
        {milestoneId && (
          <AlertDialog
            title="Delete milestone"
            onConfirm={async () => {
              try {
                startTransition(async () => {
                  await deleteProjectMilestone({ milestoneId })
                  // toast.positive('Milestone removed successfully')
                  // setOpen(false)
                })
              } catch (error) {
                console.error(error)
                // toast.negative('Something went wrong. Please try again later.')
              }
            }}
          >
            <Button
              disabled={isPending}
              variant="outline"
              icon={<DeleteIcon />}
              aria-label="Delete milestone"
            />
          </AlertDialog>
        )}

        <div className="flex-1">
          <button
            type="submit"
            className="flex h-10 w-full items-center justify-center gap-1 rounded-16 bg-customisation-blue-50 text-15 font-medium text-white-100 transition-colors active:bg-customisation-blue-60 hover:bg-customisation-blue-60 disabled:bg-customisation-blue-50/20"
            disabled={loading || !form.formState.isDirty}
          >
            {loading ? (
              <LoadingIcon className="text-white-100" />
            ) : (
              'Save milestone'
            )}
          </button>
        </div>
      </Drawer.Footer>
    </Form>
  )
}

export { EditMilestoneDrawer }
