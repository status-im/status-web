import React from 'react'

import { Button, Group } from './styles'

interface Props<V> {
  value: V
  onChange: (value: V) => void
  children: React.ReactElement[]
}

const ButtonGroup = <Value extends string>(props: Props<Value>) => {
  const { children, value, onChange } = props

  const handleChange = (value: string) => {
    // Ensure non-empty value
    if (value) {
      onChange(value as Value)
    }
  }

  return (
    <Group type="single" value={value} onValueChange={handleChange}>
      {children}
    </Group>
  )
}

interface ItemProps {
  value: string
  children: string
}

const ButtonGroupItem = (props: ItemProps) => {
  const { value, children } = props

  return <Button value={value}>{children}</Button>
}

ButtonGroup.Item = ButtonGroupItem

export { ButtonGroup }
export type { Props as ButtonGroupProps }
