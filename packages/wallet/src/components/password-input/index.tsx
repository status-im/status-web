import { useState } from 'react'

import { Input } from '@status-im/components'
import { HideIcon, RevealIcon } from '@status-im/icons/20'
import { useController } from 'react-hook-form'

import type { UseControllerProps } from 'react-hook-form'

export const MIN_PASSWORD_LENGTH = 12
export const MAX_PASSWORD_LENGTH = 128

type Props = React.ComponentPropsWithoutRef<'input'> &
  UseControllerProps & {
    label: string
    placeholder?: string
  }

function PasswordInput(props: Props) {
  const { label, placeholder } = props
  const [showPassword, setShowPassword] = useState(false)

  const { field, fieldState } = useController(props)
  const invalid = fieldState.invalid

  return (
    <div className="relative">
      <Input
        {...field}
        type={showPassword ? 'text' : 'password'}
        placeholder={placeholder}
        data-invalid={invalid}
        aria-label={label}
        autoComplete="off"
        maxLength={MAX_PASSWORD_LENGTH}
        hideCounter
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
