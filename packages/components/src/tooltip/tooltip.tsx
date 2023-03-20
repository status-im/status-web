import { forwardRef } from 'react'

import {
  Arrow,
  Content,
  Portal,
  Root,
  TooltipProvider,
  Trigger,
} from '@radix-ui/react-tooltip'
import { Stack } from 'tamagui'

import { Text } from '../text'

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
            asChild
            side={side}
            sideOffset={sideOffset}
            align={align}
            alignOffset={alignOffset}
          >
            <Stack
              backgroundColor="$neutral-95"
              paddingVertical={6}
              paddingHorizontal={12}
              borderRadius={8}
              shadowRadius={30}
              shadowOffset="0px 8px"
              shadowColor="rgba(9, 16, 28, 0.12)"
            >
              {typeof content === 'string' ? (
                <Text size={13} weight="medium" color="$white-100">
                  {content}
                </Text>
              ) : (
                content
              )}
              <Arrow width={11} height={5} />
            </Stack>
          </Content>
        </Portal>
      </Root>
    </TooltipProvider>
  )
}

const _Tooltip = forwardRef(Tooltip)

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
