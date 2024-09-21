import { forwardRef } from 'react'

import * as Popover from '@radix-ui/react-popover'
import { cx } from 'cva'

type Props = Popover.PopoverProps & {
  children: [React.ReactElement, React.ReactElement]
  onOpenChange?: (open: boolean) => void
}

export const Root = (props: Props) => {
  const { children, ...rootProps } = props

  const [trigger, content] = children

  return (
    <Popover.Root {...rootProps}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>
      {content}
    </Popover.Root>
  )
}

export const Content = forwardRef<
  React.ElementRef<typeof Popover.Content>,
  React.ComponentPropsWithoutRef<typeof Popover.Content>
>((props, ref) => {
  return (
    <Popover.Portal>
      <Popover.Content
        ref={ref}
        {...props}
        className={cx('rounded-6 bg-white-100 shadow-3', props.className)}
      />
    </Popover.Portal>
  )
})

Content.displayName = Popover.Content.displayName
