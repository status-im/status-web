import React, { forwardRef } from 'react'

import { Text } from '../text'
import { Indicator, Root, Wrapper } from './styles'

import type { Ref } from 'react'

interface Props {
  children: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  required?: boolean
}

const Checkbox = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const { children, checked, onChange, required } = props

  return (
    <Wrapper>
      <Root
        ref={ref}
        checked={checked}
        onCheckedChange={onChange}
        required={required}
      >
        <Indicator>{/* TODO: add <CheckIcon /> */}</Indicator>
      </Root>
      <Text>{children}</Text>
    </Wrapper>
  )
}

const _Checkbox = forwardRef(Checkbox)

export { _Checkbox as Checkbox }
export type { Props as CheckboxProps }
