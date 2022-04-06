import React, { forwardRef, useRef } from 'react'

import { composeRefs } from '@radix-ui/react-compose-refs'

import { TextInput } from '../text-input'
import { CopyButton, Wrapper } from './styles'

import type { Ref } from 'react'

interface Props {
  value: string
  label?: string
}

const CopyInput = (props: Props, ref: Ref<HTMLInputElement>) => {
  const { value, label } = props

  const inputRef = useRef<HTMLInputElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    inputRef.current?.select()
  }

  return (
    <Wrapper>
      <TextInput
        ref={composeRefs(inputRef, ref)}
        readOnly
        defaultValue={value}
        onClick={() => inputRef.current?.select()}
        label={label}
      />
      <CopyButton type="button" onClick={handleCopy}>
        Copy
      </CopyButton>
    </Wrapper>
  )
}

const _CopyInput = forwardRef(CopyInput)

export { _CopyInput as CopyInput }
export type { Props as CopyInputProps }
