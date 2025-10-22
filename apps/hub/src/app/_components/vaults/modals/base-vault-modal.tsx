'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon } from '@status-im/icons/20'

import type { ReactNode } from 'react'

interface BaseVaultModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose: () => void
  title: string
  description: string
  children?: ReactNode
  trigger?: ReactNode
}

/**
 * Base modal component for vault-related actions.
 * Provides consistent dialog wrapper with close button, overlay, and styling.
 */
export function BaseVaultModal(props: BaseVaultModalProps) {
  const { open, onOpenChange, onClose, title, description, children, trigger } =
    props

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen)
    }
    if (!nextOpen) {
      onClose()
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      {trigger && <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>}
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-20 bg-white-100 shadow-3">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-3 top-3 z-50 flex size-8 items-center justify-center rounded-10 border border-neutral-80/10 backdrop-blur-[20px] transition-colors hover:bg-neutral-10 focus:outline-none"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>

            <div className="flex flex-col items-center px-4 pb-4 pt-8">
              <Dialog.Title asChild>
                <div className="flex w-full items-center gap-1.5">
                  <span className="shrink-0 grow basis-0 text-19 font-semibold text-neutral-100">
                    {title}
                  </span>
                </div>
              </Dialog.Title>
              <Dialog.Description asChild>
                <div className="flex w-full flex-col justify-center text-15 text-neutral-100">
                  <span>{description}</span>
                </div>
              </Dialog.Description>
            </div>

            {children}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
