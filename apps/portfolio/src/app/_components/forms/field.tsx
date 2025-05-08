import { useId } from 'react'

import { AlertIcon } from '@status-im/icons/20'

type Props = {
  label: string
  children: React.ReactNode
  error?: string
}

const Field = (props: Props) => {
  const { label, children, error } = props

  const id = useId()

  return (
    <div className="relative w-full">
      <label
        htmlFor={id}
        className="mb-2 block text-13 font-medium text-neutral-50"
      >
        {label}
      </label>
      <div className="grid gap-2">
        {children}
        {error && (
          <p
            role="alert"
            className="flex items-center gap-1 text-13 text-danger-50"
          >
            <AlertIcon className="text-danger-50" />
            {error}
          </p>
        )}
      </div>
    </div>
  )
}

export { Field }
