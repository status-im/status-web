import React, { forwardRef } from 'react'

import * as Primitive from '@radix-ui/react-popover'

import { Content } from './styles'

interface TriggerProps {
  children: [React.ReactElement, React.ReactElement]
}

const PopoverTrigger = (props: TriggerProps) => {
  const { children } = props

  const [trigger, content] = children

  return (
    <Primitive.Root>
      <Primitive.Trigger asChild>{trigger}</Primitive.Trigger>
      {content}
    </Primitive.Root>
  )
}

interface PopoverProps {
  children: React.ReactNode
}

const Popover = (props: PopoverProps, ref) => {
  const { children } = props

  return (
    <Content as={Primitive.Content} portalled={true} ref={ref}>
      {children}
    </Content>
  )
}

const _Popover = forwardRef(Popover)

export { _Popover as Popover, PopoverTrigger }
