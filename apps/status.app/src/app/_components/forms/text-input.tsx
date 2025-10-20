'use client'

import { cx } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import { Field } from './field'

import type { UseControllerProps } from 'react-hook-form'

type Props = React.ComponentPropsWithoutRef<'input'> &
  UseControllerProps & {
    label: string
    placeholder?: string
    mono?: boolean
  }

const TextInput = (props: Props) => {
  const { label, placeholder, mono = false, maxLength, ...inputProps } = props

  const { field, fieldState } = useController(props)

  const invalid = fieldState.invalid

  return (
    <Field label={label} error={fieldState.error?.message}>
      <input
        {...field}
        {...inputProps}
        maxLength={maxLength}
        placeholder={placeholder}
        data-invalid={invalid}
        autoComplete="off"
        className={cx(
          // input has to have at least 16px font size to prevent from "zooming in" on mobile
          'h-10 w-full rounded-12 border border-solid bg-white-100 px-4 text-15 font-medium placeholder:font-regular max-sm:text-[1rem]',
          'border-neutral-30 data-[invalid=true]:border-danger-50 focus:border-neutral-40',
          mono && 'font-mono',
          'disabled:cursor-not-allowed disabled:border-0 disabled:bg-neutral-5 disabled:text-neutral-50'
        )}
      />

      {maxLength && (
        <p className="absolute right-0 top-0 text-13 font-medium text-neutral-50">
          {(field.value as string).length}/{maxLength}
        </p>
      )}
    </Field>
  )
}

export { TextInput }
