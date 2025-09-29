'use client'

import { useId, useRef } from 'react'

import { Button } from '@status-im/components'
import { DeleteIcon } from '@status-im/icons/16'
import { AttachIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useController, useFormContext } from 'react-hook-form'

import { readFile } from '~app/_utils/read-file'

import { Field } from './field'

type Props = {
  label: string
  name: string
  required?: boolean
  placeholder?: string
}

const allowedFileTypes = [
  'application/pdf', // pdf
  'application/msword', // doc
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'text/plain', // txt
  'application/rtf', // rtf
]

const FileInput = (props: Props) => {
  const { label, name, placeholder, required = false } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const { setError, setValue } = useFormContext()
  const { field, fieldState } = useController({
    name,
    ...(required && {
      rules: {
        validate: v => {
          return (
            (v.filename !== '' && v.content !== '') || 'This field is required'
          )
        },
      },
    }),
  })

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      return
    }

    if (!allowedFileTypes.includes(file.type)) {
      setError(field.name, {
        type: 'custom',
        message: 'File type is not allowed.',
      })
      return
    }

    if (file.size > 3000000) {
      setError(field.name, {
        type: 'custom',
        message: 'The maximum size for file uploads is 3 MB.',
      })
      return
    }

    if (file.size <= 0) {
      setError(field.name, {
        type: 'custom',
        message: 'File seems corrupted, try uploading another one.',
      })
      return
    }

    // @see https://developers.greenhouse.io/job-board.html#submit-an-application
    setValue(
      field.name,
      {
        filename: file.name,
        content: await readFile(file),
      },
      { shouldValidate: true }
    )
  }

  const handleRemove = () => {
    setValue(
      field.name,
      {
        filename: '',
        content: '',
      },
      { shouldValidate: true }
    )
  }

  const id = useId()

  const filename = field.value?.filename
  const error = fieldState.error

  return (
    <Field label={label} error={error?.message}>
      <div
        className={cx(
          'grid h-10 grid-cols-3 flex-row justify-between rounded-12 border border-solid p-2',
          error ? 'border-danger-50' : 'border-neutral-30',
          'focus:border-neutral-40'
        )}
      >
        <label
          htmlFor={id}
          className={cx(
            'col-span-2 mr-5 flex max-w-full flex-row items-center justify-start gap-2 text-15 font-medium',
            filename ? 'text-neutral-100' : 'text-neutral-40'
          )}
        >
          <AttachIcon className="min-w-[20px] text-neutral-50" />
          <span className="truncate">
            {filename === '' ? 'Select a file' : filename}
          </span>
        </label>
        <div className="flex justify-end">
          {filename ? (
            <Button
              key={filename}
              onPress={handleRemove}
              variant="outline"
              size="24"
              iconBefore={<DeleteIcon />}
            >
              Remove
            </Button>
          ) : (
            <Button
              key={filename}
              size="24"
              variant="outline"
              onPress={() => inputRef.current?.click()}
            >
              Upload
            </Button>
          )}
        </div>

        <input
          id={id}
          ref={inputRef}
          type="file"
          className="hidden"
          placeholder={placeholder}
          accept={allowedFileTypes.join(',')}
          onChange={e => handleChange(e)}
        />
      </div>
    </Field>
  )
}

export { FileInput }
