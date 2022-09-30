import React, { cloneElement, forwardRef } from 'react'

import * as Primitive from '@radix-ui/react-tooltip'

import { Arrow, Content } from './styles'

import type {
  TooltipArrowProps,
  TooltipContentProps,
} from '@radix-ui/react-tooltip'
import type { Ref } from 'react'

interface Props {
  label: string
  children: React.ReactElement
  side?: TooltipContentProps['side']
  sideOffset?: TooltipContentProps['sideOffset']
  align?: TooltipContentProps['align']
  arrowOffset?: TooltipArrowProps['offset']
}

const Tooltip = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    children,
    label,
    side = 'top',
    sideOffset = 5,
    align = 'center',
    arrowOffset = 0,
    ...triggerProps
  } = props

  return (
    <Primitive.Provider>
      <Primitive.Root delayDuration={500}>
        <Primitive.Trigger asChild>
          {cloneElement(children, { ref, ...triggerProps })}
        </Primitive.Trigger>
        <Content side={side} sideOffset={sideOffset} align={align}>
          {label}
          <Arrow offset={arrowOffset} />
        </Content>
      </Primitive.Root>
    </Primitive.Provider>
  )
}

const _Tooltip = forwardRef(Tooltip)

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
