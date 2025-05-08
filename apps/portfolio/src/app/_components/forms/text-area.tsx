'use client'

import { cx } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import { Field } from './field'

import type { UseControllerProps } from 'react-hook-form'

type Props = React.ComponentPropsWithoutRef<'textarea'> &
  UseControllerProps & {
    label: string
    placeholder?: string
    mono?: boolean
  }

const TextArea = (props: Props) => {
  const { label, placeholder, mono = false, ...inputProps } = props

  const { field, fieldState } = useController(props)

  const invalid = fieldState.invalid

  return (
    <Field label={label} error={fieldState.error?.message}>
      <textarea
        {...field}
        {...inputProps}
        placeholder={placeholder}
        data-invalid={invalid}
        className={cx(
          'min-h-20 w-full rounded-12 border border-solid bg-white-100 px-4 py-2 text-15 font-medium placeholder:font-regular',
          'border-neutral-30 data-[invalid="true"]:border-danger-50 focus:border-neutral-40',
          'resize-none',
          'break-words',
          mono && 'font-mono'
        )}
      />
    </Field>
  )
}

export { TextArea }
