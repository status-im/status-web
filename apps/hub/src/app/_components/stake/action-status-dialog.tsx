/* eslint-disable import/no-unresolved */
import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon } from '@status-im/icons/20'
import { match } from 'ts-pattern'

import { ProcessingIcon, RejectIcon, VaultIcon } from '../icons'

import type { ActionStatusState } from './use-action-status-content'

type Props = {
  open: boolean
  onClose: () => void
  title: string
  description: string
  children?: React.ReactNode
  state?: ActionStatusState
  showCloseButton?: boolean
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

        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 min-h-[198px] w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="relative mx-auto min-h-[198px] w-[440px] overflow-hidden rounded-20 shadow-3">
            <div className="absolute inset-0 h-full rounded-20 bg-white-100" />
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
            <div className="relative z-10 flex min-h-[198px] flex-col items-center justify-center gap-2 p-8">
              {mapIconToState(state)}
              <Dialog.Title asChild>
                <h2 className="text-center text-19 font-semibold text-neutral-100">
                  {title}
                </h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <span className="text-15 text-neutral-100">{description}</span>
              </Dialog.Description>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { ActionStatusDialog }
