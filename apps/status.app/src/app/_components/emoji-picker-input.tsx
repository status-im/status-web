import { useController } from 'react-hook-form'

import { EmojiPicker } from '~admin/_components/emoji-picker'

type Props = {
  name: string
  children?: React.ReactNode
}

const EmojiPickerInput = (props: Props) => {
  const { name, children } = props

  const { field } = useController({ name })

  return (
    <EmojiPicker
      onSelect={emoji => field.onChange(emoji.char)}
      emoji={{ char: field.value }}
    >
      {children}
    </EmojiPicker>
  )
}

export { EmojiPickerInput }
