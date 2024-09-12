import { Content, Portal, Root, Trigger } from '@radix-ui/react-popover'

import type { PopoverContentProps } from '@radix-ui/react-popover'

interface Props {
  children: [React.ReactElement, React.ReactElement]
  onOpenChange?: (open: boolean) => void
  modal?: false
  side?: PopoverContentProps['side']
  sideOffset?: PopoverContentProps['sideOffset']
  align?: PopoverContentProps['align']
  alignOffset?: PopoverContentProps['alignOffset']
}

const Popover = (props: Props) => {
  const { children, onOpenChange, modal, ...contentProps } = props

  const [trigger, content] = children

  return (
    <Root onOpenChange={onOpenChange} modal={modal}>
      <Trigger asChild>{trigger}</Trigger>
      <Portal>
        <Content {...contentProps}>{content}</Content>
      </Portal>
    </Root>
  )
}

type ContentProps = {
  children: React.ReactNode
}

const PopoverContent = (props: ContentProps) => {
  const { children } = props

  return <div className="rounded-6 bg-white-100 shadow-3">{children}</div>
}

Popover.Content = PopoverContent

export { Popover }
export type { Props as PopoverProps }
