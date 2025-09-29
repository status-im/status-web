'use client'

import { useState } from 'react'

import { Button, useToast } from '@status-im/components'
import { ExternalIcon } from '@status-im/icons/16'
import { LoadingIcon } from '@status-im/icons/20'
import { useForm } from 'react-hook-form'

import { Dialog } from '~components/dialog'
import { Checkbox } from '~components/forms/checkbox'
import { FileInput } from '~components/forms/file-input'
import { Form } from '~components/forms/form'
import { Select } from '~components/forms/select'
import { TextArea } from '~components/forms/text-area'
import { TextInput } from '~components/forms/text-input'
import { Link } from '~components/link'

import type { Job } from '~website/_lib/greenhouse'
import type { DefaultValues, FieldValues, SubmitHandler } from 'react-hook-form'

type Props = {
  job: Job
  children: React.ReactElement
}

export const ApplicationFormDialog = (props: Props) => {
  const { children, job } = props
  const { questions } = job

  const toast = useToast()
  const [openDialog, setOpenDialog] = useState(false)

  const onSubmit: SubmitHandler<FieldValues> = async data => {
    try {
      const response = await fetch(`/api/jobs/${job.id}/application`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          mapped_url_token: new URLSearchParams(window.location.search).get(
            'gh_src'
          ),
        }),
      })

      if (!response.ok) {
        toast.negative('Error submitting an application')

        return
      }

      toast.positive('Thank you! Your application was submitted successfully!')
      setOpenDialog(false)
    } catch (e) {
      // ideally we should use some service to catch these errors
      toast.negative('During submission an error occurred, please try again.')
      console.error(e)
    }
  }

  return (
    <Dialog onOpenChange={setOpenDialog} open={openDialog}>
      {children}
      <Dialog.Content title="Apply for this job">
        <ApplicationForm questions={questions} onSubmit={onSubmit} />
      </Dialog.Content>
    </Dialog>
  )
}

type ApplicationFormProps = {
  questions: Job['questions']
  onSubmit: SubmitHandler<FieldValues>
}

const ApplicationForm = (props: ApplicationFormProps) => {
  const { questions, onSubmit } = props

  const form = useForm({
    defaultValues: questions.reduce(
      (acc, question) => {
        const { fields } = question
        const field = fields[0]

        if (!field) {
          return acc
        }

        switch (field.type) {
          case 'input_file': {
            // @see https://developers.greenhouse.io/job-board.html#submit-an-application
            acc[field.name] = {
              filename: '',
              content: '',
            }
            break
          }
          case 'multi_value_multi_select': {
            acc[field.name] = []
            break
          }
          default: {
            acc[field.name] = ''
            break
          }
        }

        return acc
      },
      { privacyNotice: false } as DefaultValues<FieldValues>
    ),
    mode: 'onTouched',
  })

  const {
    formState: { isSubmitting },
  } = form

  const handleSubmit = async (values: FieldValues) => {
    const data: FieldValues = {}

    for (const { fields } of questions) {
      const field = fields[0]

      switch (field.type) {
        case 'input_file': {
          if (values[field.name].content !== '') {
            data[`${field.name}_content_filename`] = values[field.name].filename
            data[`${field.name}_content`] = values[field.name].content
          }
          break
        }

        default: {
          data[field.name] = values[field.name]
        }
      }
    }

    await onSubmit(data)
  }

  return (
    <Form
      {...form}
      onSubmit={handleSubmit}
      className="flex flex-col overflow-hidden"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 scrollbar-none">
        {questions.map(question => {
          const { required } = question
          const label = `${question.label}${required ? '' : ' (optional)'}`
          const field = question.fields[0]

          switch (field.type) {
            case 'input_text':
              return (
                <TextInput
                  key={field.name}
                  label={label}
                  name={field.name}
                  rules={{
                    required: required ? 'This field is required' : false,
                    ...(field.name.toLowerCase().includes('email') && {
                      pattern: {
                        // @see https://github.com/colinhacks/zod/blob/master/src/types.ts#L567
                        value: /^(?!\.)(?!.*\.\.)([A-Z0-9_+-.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9-]*\.)+[A-Z]{2,}$/i, // prettier-ignore
                        message: 'Please enter a valid email',
                      },
                    }),
                  }}
                />
              )

            case 'textarea':
              return (
                <TextArea
                  key={field.name}
                  label={label}
                  name={field.name}
                  rules={{
                    required: required ? 'This field is required' : false,
                  }}
                />
              )

            case 'input_file':
              return (
                <FileInput
                  key={field.name}
                  label={label}
                  name={field.name}
                  required={required}
                />
              )

            case 'multi_value_single_select':
              return (
                <Select
                  key={field.name}
                  label={label}
                  name={field.name}
                  options={field.values}
                  required={required}
                />
              )

            case 'multi_value_multi_select':
              return (
                <Select
                  key={field.name}
                  label={label}
                  name={field.name}
                  options={field.values}
                  required={required}
                  multiple
                />
              )

            default: {
              // @ts-expect-error unhandled type
              const unhandled: never = question.fields[0]
              console.warn('Unhandled question type:', unhandled)
              return null
            }
          }
        })}
      </div>

      <div className="flex flex-col justify-between gap-4 border-t border-dashed border-neutral-80/20 bg-white-100 p-4 md:flex-row">
        <Checkbox name="privacyNotice" rules={{ validate: v => v === true }}>
          <p className="flex gap-1">
            I confirm I have read the
            <Link
              href="/legal/privacy-notice"
              className="group flex flex-row items-center font-medium hover:opacity-[50%]"
              target="_blank"
            >
              Privacy Notice{' '}
              <ExternalIcon className="transition-transform group-hover:translate-x-[2px] group-hover:translate-y-[-2px]" />
            </Link>
          </p>
        </Checkbox>
        <div className="grid">
          <Button
            disabled={isSubmitting}
            variant="primary"
            onPress={form.handleSubmit(handleSubmit)}
            {...(isSubmitting && {
              iconBefore: (
                <LoadingIcon className="animate-spin text-white-100" />
              ),
            })}
          >
            Submit
          </Button>
        </div>
      </div>
    </Form>
  )
}
