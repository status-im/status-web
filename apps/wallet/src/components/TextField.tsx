import { Input, type InputProps } from '@status-im/components'
import {
  type Control,
  type FieldValues,
  type Path,
  useController,
} from 'react-hook-form'

type TextFieldProps<T extends FieldValues> = {
  control: Control<T>
  name: Path<T>
  label?: string
} & InputProps

function TextField<T extends FieldValues>({
  control,
  name,
  label,
  ...props
}: TextFieldProps<T>) {
  const { field } = useController({
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
