import { forwardRef } from 'react'

import {
  Arrow,
  Content,
  Portal,
  Root,
  TooltipProvider,
  Trigger,
} from '@radix-ui/react-tooltip'

import type { TooltipContentProps } from '@radix-ui/react-tooltip'
import type { Ref } from 'react'

interface Props {
  children: React.ReactElement
  content: React.ReactNode
  delayDuration?: number
  side?: TooltipContentProps['side']
  sideOffset?: TooltipContentProps['sideOffset']
  align?: TooltipContentProps['align']
  alignOffset?: TooltipContentProps['alignOffset']
}

const Tooltip = (props: Props, ref: Ref<HTMLButtonElement>) => {
  const {
    children,
    content,
    delayDuration,
    side,
    sideOffset,
    align,
    alignOffset,
    ...triggerProps
  } = props

  return (
    <TooltipProvider>
      <Root delayDuration={delayDuration}>
        <Trigger {...triggerProps} ref={ref} asChild>
          {children}
        </Trigger>

        <Portal>
          <Content
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
            className="z-50"
          >
            <div className="rounded-8 bg-white-100 px-3 py-1.5 shadow-3">
              {typeof content === 'string' ? (
                <p className="text-13 font-medium text-neutral-100">
                  {content}
                </p>
              ) : (
                content
              )}
              <Arrow width={11} height={5} className="fill-white-100" />
            </div>
          </Content>
        </Portal>
      </Root>
    </TooltipProvider>
  )
}

const _Tooltip = forwardRef(Tooltip)

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
