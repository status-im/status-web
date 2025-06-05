import {
  Textarea,
  type TextareaProps as StatusTextareaProps,
} from '@status-im/components'
import { useController } from 'react-hook-form'

import type { Control, FieldValues, Path } from 'react-hook-form'

type FormTextareaProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label?: string
} & StatusTextareaProps

// TODO: consider if we want to make it as a part of Textarea from @status-im/components
function TextArea<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: FormTextareaProps<T>) {
  const { field } = useController({
    name,
    control,
    rules: { required: true },
  })

  return (
    <Textarea
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

export default TextArea
