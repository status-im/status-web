import React, { cloneElement, forwardRef } from 'react'

import * as Primitive from '@radix-ui/react-tooltip'

import { Arrow, Content } from './styles'

import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import type { Ref } from 'react'

interface Props {
  label: string
  children: React.ReactElement
  side?: TooltipContentProps['side']
  sideOffset?: TooltipContentProps['sideOffset']
}

const Tooltip = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    children,
    label,
    side = 'top',
    sideOffset = 5,
    ...triggerProps
  } = props

  return (
    <Primitive.Root delayDuration={500}>
      <Primitive.Trigger asChild>
        {cloneElement(children, { ref, ...triggerProps })}
      </Primitive.Trigger>
      <Content side={side} sideOffset={sideOffset}>
        {label}
        <Arrow />
      </Content>
    </Primitive.Root>
  )
}

const _Tooltip = forwardRef(Tooltip)

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
