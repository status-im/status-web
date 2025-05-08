import { useId } from 'react'

import { Checkbox } from '@status-im/components'
import { cx } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import type { UseControllerProps } from 'react-hook-form'

type Props = UseControllerProps & {
  name: string
  children: React.ReactNode
}

const FormCheckbox = (props: Props) => {
  const { children } = props

  const { field, fieldState } = useController(props)

  const id = useId()

  return (
    <label
      className={cx(
        'flex cursor-pointer select-none items-center gap-2 text-15',
        fieldState.error && 'text-danger-50'
      )}
    >
      <div
        className={cx(
          'flex shrink-0 items-center',
          fieldState.error && ['[&>button]:!border-default-danger-50']
        )}
      >
        <Checkbox
          id={id}
          variant="outline"
          checked={field.value}
          onCheckedChange={v => field.onChange(v)}
        />
      </div>
      {children}
    </label>
  )
}

export { FormCheckbox as Checkbox }
