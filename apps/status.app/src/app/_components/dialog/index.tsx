import { cloneElement, forwardRef } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'

type Props = {
  children: [React.ReactElement, JSX.Element]
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const _Dialog = (props: Props) => {
  const { children, open, onOpenChange } = props

  const [trigger, content] = children

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cx(
            'fixed inset-0 z-10 bg-blur-neutral-100/70',
            'data-[state=open]:animate-[overlay-enter_200ms]',
            'data-[state=closed]:animate-[overlay-exit_200ms]'
          )}
        />

        <Dialog.Content
          className={cx(
            'fixed z-10 focus:outline-none',
            // drawer
            'max-md:inset-x-0 max-md:bottom-0 max-md:mt-24',
            'data-[state=closed]:animate-[drawer-exit_200ms] data-[state=open]:animate-[drawer-enter_200ms_backwards]',
            // dialog
            'md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2',
            'md:data-[state=closed]:animate-[dialog-exit_100ms] md:data-[state=open]:animate-[dialog-enter_100ms_50ms_backwards]'
          )}
        >
          {cloneElement(content, { onClose: () => onOpenChange?.(false) })}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

type ContentProps = {
  children: React.ReactNode
  title?: string
  onClose?: () => void
  className?: string
}

const Content = (props: ContentProps) => {
  const { children, title, onClose } = props

  return (
    <div
      className={cx(
        'flex max-h-[95dvh] flex-col overflow-hidden rounded-t-20 bg-white-100 md:w-[calc(100vw-40px)] md:max-w-[480px] md:rounded-20',
        props.className
      )}
    >
      {title && (
        <div className="flex items-center justify-between p-3 pb-2 pl-4">
          <h2 className="text-19 font-semibold">{title}</h2>
          <Button
            variant="outline"
            size="32"
            icon={<CloseIcon />}
            onPress={onClose}
            aria-label="Close"
          />
        </div>
      )}
      {children}
    </div>
  )
}

const Title = forwardRef<
  React.ElementRef<typeof Dialog.Title>,
  React.ComponentPropsWithoutRef<typeof Dialog.Title>
>(function Title(props, ref) {
  return <Dialog.Title {...props} ref={ref} />
})

const Description = forwardRef<
  React.ElementRef<typeof Dialog.Description>,
  React.ComponentPropsWithoutRef<typeof Dialog.Description>
>(function Description(props, ref) {
  return <Dialog.Description {...props} ref={ref} />
})

const Close = forwardRef<
  React.ElementRef<typeof Dialog.Close>,
  React.ComponentPropsWithoutRef<typeof Dialog.Close>
>(function Close(props, ref) {
  return <Dialog.Close {...props} asChild ref={ref} />
})

_Dialog.Content = Content
_Dialog.Title = Title
_Dialog.Description = Description
_Dialog.Close = Close

export { _Dialog as Dialog }
