import React, { cloneElement, forwardRef } from 'react'

import * as Primitive from '@radix-ui/react-popover'

import { Content } from './styles'

import type { PopoverContentProps } from '@radix-ui/react-popover'
import type Stitches from '@stitches/react'
import type { Ref } from 'react'

interface TriggerProps {
  children: [React.ReactElement, React.ReactElement]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const PopoverTrigger = (props: TriggerProps, ref: Ref<HTMLButtonElement>) => {
  const { children, open, onOpenChange, ...triggerProps } = props

  const [trigger, content] = children

  return (
    <Primitive.Root open={open} onOpenChange={onOpenChange}>
      <Primitive.Trigger asChild>
        {cloneElement(trigger, { ref, ...triggerProps })}
      </Primitive.Trigger>
      {content}
    </Primitive.Root>
  )
}

const _PopoverTrigger = forwardRef(PopoverTrigger)

interface PopoverProps extends PopoverContentProps {
  children: React.ReactNode
  css?: Stitches.CSS
}

const Popover = (props: PopoverProps) => {
  const { children, css, ...contentProps } = props

  return (
    <Content as={Primitive.Content} css={css} {...contentProps}>
      {children}
    </Content>
  )
}

export { Popover, _PopoverTrigger as PopoverTrigger }
