import { Textarea } from '@status-im/components'
import { useController } from 'react-hook-form'

import type { UseControllerProps } from 'react-hook-form'

export type Props = React.ComponentPropsWithoutRef<'textarea'> &
  UseControllerProps & {
    label: string
    placeholder?: string
  }

function RecoveryPhraseTextarea(props: Props) {
  const { label, placeholder } = props
  const { field, fieldState } = useController(props)
  const invalid = fieldState.invalid

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pastedText = event.clipboardData.getData('text')
    const trimmedText = pastedText.trim()
    field.onChange(trimmedText)
  }

  return (
    <Textarea
      {...field}
      placeholder={placeholder}
      data-invalid={invalid}
      aria-label={label}
      onPaste={handlePaste}
    />
  )
}

export { RecoveryPhraseTextarea }
