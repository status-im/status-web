'use client'

import { useState } from 'react'

import { HideIcon, RevealIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import type { UseControllerProps } from 'react-hook-form'

export const MIN_PASSWORD_LENGTH = 12
export const MAX_PASSWORD_LENGTH = 128

type Props = React.ComponentPropsWithoutRef<'input'> &
  UseControllerProps & {
    label: string
    placeholder?: string
  }

const PasswordInput = (props: Props) => {
  const { label, placeholder, ...inputProps } = props
  const [showPassword, setShowPassword] = useState(false)

  const { field, fieldState } = useController(props)
  const invalid = fieldState.invalid

  return (
    <div className="relative">
      <input
        {...field}
        {...inputProps}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        data-invalid={invalid}
        aria-label={label}
        autoComplete="off"
        maxLength={MAX_PASSWORD_LENGTH}
        className={cx(
          'h-10 w-full rounded-12 border border-solid bg-white-100 px-4 text-15 font-medium placeholder:font-regular max-sm:text-[1rem]',
          'border-neutral-30 data-[invalid=true]:border-danger-50 focus:border-neutral-40',
          'disabled:cursor-not-allowed disabled:border-0 disabled:bg-neutral-5 disabled:text-neutral-50',
        )}
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-50 hover:text-neutral-70"
      >
        {showPassword ? <HideIcon /> : <RevealIcon />}
      </button>
    </div>
  )
}

export { PasswordInput }
