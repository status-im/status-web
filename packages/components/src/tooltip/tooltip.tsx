import { forwardRef } from 'react'

import {
  Arrow,
  Content,
  Portal,
  Root,
  TooltipProvider,
  Trigger,
} from '@radix-ui/react-tooltip'
import { useTheme } from 'tamagui'

import { Shadow } from '../shadow'
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

  const theme = useTheme() // not ideal

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
            <Shadow
              variant="$3"
              backgroundColor="$white-100"
              paddingVertical={6}
              paddingHorizontal={12}
              borderRadius="$8"
            >
              {typeof content === 'string' ? (
                <Text size={13} weight="medium" color="$neutral-100">
                  {content}
                </Text>
              ) : (
                content
              )}
              <Arrow width={11} height={5} fill={theme.background.val} />
            </Shadow>
          </Content>
        </Portal>
      </Root>
    </TooltipProvider>
  )
}

const _Tooltip = forwardRef(Tooltip)

export { _Tooltip as Tooltip }
export type { Props as TooltipProps }
