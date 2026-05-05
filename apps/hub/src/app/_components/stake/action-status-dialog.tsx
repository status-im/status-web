import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon } from '@status-im/icons/20'
import { match } from 'ts-pattern'

import { ProcessingIcon, RejectIcon, VaultIcon } from '../icons'
import { type ActionStatusState } from './types/action-status'

type Props = {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children?: React.ReactNode
  state?: ActionStatusState
  showCloseButton?: boolean
  content?: React.ReactNode
}

const ActionStatusDialog = (props: Props) => {
  const {
    open,
    onClose,
    title,
    description,
    children,
    state = 'pending',
    showCloseButton = true,
    content,
  } = props

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && showCloseButton) {
      onClose()
    }
  }

  const mapIconToState = (state: ActionStatusState) => {
    return match(state)
      .with('pending', () => <VaultIcon />)
      .with('processing', () => <ProcessingIcon />)
      .with('error', () => <RejectIcon />)
      .with('success', () => <VaultIcon />)
      .otherwise(() => null)
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />

        <Dialog.Content className="fixed inset-x-0 top-0 z-50 flex size-full flex-col items-center justify-center p-4 focus:outline-none md:left-1/2 md:top-1/2 md:h-auto md:max-w-[440px] md:-translate-x-1/2 md:-translate-y-1/2 md:py-0">
          <div className="relative mx-auto min-h-[198px] w-full overflow-y-auto rounded-20 bg-white-100 shadow-3 max-md:max-h-full md:w-[440px]">
            {showCloseButton && (
              <Dialog.Close asChild>
                <button
                  aria-label="Close"
                  className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-12 border border-neutral-20 p-2 transition-colors hover:bg-neutral-20 focus:outline-none focus:ring-2 focus:ring-neutral-40"
                >
                  <CloseIcon className="text-neutral-100" />
                </button>
              </Dialog.Close>
            )}
            {content ? (
              <div>{content}</div>
            ) : (
              <div className="flex min-h-[198px] flex-col items-center justify-center gap-2 p-8">
                {mapIconToState(state)}
                <Dialog.Title asChild>
                  <h2 className="text-center text-19 font-semibold text-neutral-100">
                    {title}
                  </h2>
                </Dialog.Title>
                {description && (
                  <Dialog.Description asChild>
                    <span className="text-15 text-neutral-100">
                      {description}
                    </span>
                  </Dialog.Description>
                )}
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ActionStatusDialog }
