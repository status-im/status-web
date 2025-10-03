/* eslint-disable import/no-unresolved */
import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'

type Props = {
  open: boolean
  onClose: () => void
  children?: React.ReactNode
}

const VaultLockModal = (props: Props) => {
  const { open, onClose, children } = props

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 min-h-[558px] w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="relative mx-auto min-h-[558px] w-[440px] overflow-hidden rounded-20 shadow-3">
            <div className="absolute inset-0 h-full rounded-20 bg-white-100" />
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-4 top-4 z-50 flex size-10 items-center justify-center rounded-12 border border-neutral-20 p-2 transition-colors hover:bg-neutral-20 focus:outline-none focus:ring-2 focus:ring-neutral-40"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>
            <div className="relative z-10 flex min-h-[198px] flex-col items-center justify-center gap-2 p-8">
              <Dialog.Title asChild>
                <h2 className="text-19 font-semibold text-neutral-100">
                  Extend lock time
                </h2>
              </Dialog.Title>
              <Dialog.Description asChild>
                <span className="text-15 text-neutral-100">
                  Extending lock time increasing Karma boost
                </span>
              </Dialog.Description>
            </div>
          </div>
          <div className="flex items-center justify-between">
            {/* @ts-expect-error - TODO: fix this */}
            <Button onClick={onClose}>Cancel</Button>
            {/* @ts-expect-error - TODO: fix this */}
            <Button variant="primary">Extend</Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { VaultLockModal }
