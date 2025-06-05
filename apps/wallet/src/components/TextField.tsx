import { Input, type InputProps } from '@status-im/components'
import { useController } from 'react-hook-form'

import type { Control, FieldValues } from 'react-hook-form'

// TODO: consider if we want to make it as a part of Input from @status-im/components
function TextField({
  control,
  name,
  label,
  ...props
}: {
  control: Control<FieldValues>
  name: string
  label: string
} & InputProps) {
  const {
    field,
    // fieldState: { invalid, isTouched, isDirty },
    // formState: { touchedFields, dirtyFields },
  } = useController({
    name,
    control,
    rules: { required: true },
  })

  return (
    <Input
      label={label}
      onChange={field.onChange}
      onBlur={field.onBlur}
      value={field.value}
      name={field.name}
      ref={field.ref}
      {...props}
    />
  )
}

export default TextField
