import React from 'react'

import * as Primitive from '@radix-ui/react-tooltip'

import { Arrow, Content } from './styles'

import type { TooltipContentProps } from '@radix-ui/react-tooltip'

interface Props {
  label: string
  children: React.ReactNode
  side?: TooltipContentProps['side']
  sideOffset?: TooltipContentProps['sideOffset']
}

const Tooltip = (props: Props) => {
  const { children, label, side = 'top', sideOffset = 5 } = props

  return (
    <Primitive.Root delayDuration={500}>
      <Primitive.Trigger asChild>{children}</Primitive.Trigger>
      <Content side={side} sideOffset={sideOffset}>
        {label}
        <Arrow />
      </Content>
    </Primitive.Root>
  )
}

export { Tooltip }
export type { Props as TooltipProps }
