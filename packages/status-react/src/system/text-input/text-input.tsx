import React, { forwardRef } from 'react'

import { Box } from '../box'
import { Text } from '../text'
import { Base } from './styles'

import type { Ref } from 'react'

type InputProps = React.InputHTMLAttributes<HTMLInputElement>

interface Props {
  id?: string
  name?: string
  label?: string
  type?: InputProps['type']
  value?: string
  defaultValue?: string
  onChange?: InputProps['onChange']
  onBlur?: InputProps['onBlur']
  onClick?: InputProps['onClick']
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  invalid?: boolean
  autoFocus?: boolean
  maxLength?: number
  minLength?: number
  placeholder?: string
  inputMode?: InputProps['inputMode']
  autoComplete?: string // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input#htmlattrdefautocomplete
}

const TextInput = (props: Props, ref: Ref<HTMLInputElement>) => {
  const { label, ...inputProps } = props

  return (
    <Box>
      {label && (
        <Text size={13} weight={500} css={{ marginBottom: 6 }}>
          {label}
        </Text>
      )}
      <Base ref={ref} {...inputProps} />
    </Box>
  )
}

const _TextInput = forwardRef(TextInput)

export { _TextInput as TextInput }
export type { Props as TextInputProps }
