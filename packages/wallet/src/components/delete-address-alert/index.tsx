'use client'

import { useState, useTransition } from 'react'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { LoadingIcon } from '@status-im/icons/20'
import { cva } from 'class-variance-authority'

// COMPONENTS FROM RADIX UI
const AlertDialogRoot = AlertDialogPrimitive.Root
const AlertDialogPortal = AlertDialogPrimitive.Portal
const AlertDialogOverlay = AlertDialogPrimitive.Overlay
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogContent = AlertDialogPrimitive.Content
const AlertDialogCancel = AlertDialogPrimitive.Cancel
const AlertDialogTitle = AlertDialogPrimitive.Title

const AlertDialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className="flex flex-col text-left" {...props} />
)

const buttonVariants = cva(
  'relative flex h-10 w-full items-center justify-center gap-1 rounded-12 px-4 py-2 text-15 font-semibold transition disabled:cursor-not-allowed disabled:opacity-[30%]',
  {
    variants: {
      variant: {
        danger:
          'border-white-10 bg-danger-50 text-white-100 hover:border-white-20 hover:bg-danger-60',
        grey: 'bg-neutral-10 text-neutral-100 hover:bg-neutral-20',
      },
    },
  },
)

type Props = {
  title: string
  address: string
  onConfirm: () => Promise<unknown>
  children: React.ReactNode
  description?: string
  confirmButtonLabel?: string
}

const DeleteAddressAlert = (props: Props) => {
  const [open, setOpen] = useState(false)
  const {
    title,
    address,
    description = 'Are you sure you want to remove this address?',
    onConfirm,
    children,
    confirmButtonLabel = 'Confirm',
  } = props

  const [isPending, startTransition] = useTransition()

  const handleSubmit = async () => {
    startTransition(async () => {
      await onConfirm()
      setOpen(false)
    })
  }

  return (
    <AlertDialogRoot open={open} onOpenChange={setOpen}>
      {children && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-50 bg-blur-neutral-100/70 opacity-[30%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%]" />
        <AlertDialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-20 bg-white-100 p-4 shadow-1 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <AlertDialogHeader>
            <div className="flex flex-col gap-1 pb-3">
              <AlertDialogTitle className="text-19 font-semibold">
                {title}
              </AlertDialogTitle>
              <p className="text-15">{description}</p>
            </div>
            <div className="break-words rounded-12 bg-neutral-5 p-3 font-mono text-15">
              {address}
            </div>
          </AlertDialogHeader>

          <div className="mt-4 flex w-full flex-row gap-3">
            <AlertDialogCancel
              type="button"
              className={buttonVariants({ variant: 'grey' })}
              disabled={isPending}
            >
              Cancel
            </AlertDialogCancel>
            <button
              className={buttonVariants({ variant: 'danger' })}
              aria-disabled={isPending}
              disabled={isPending}
              onClick={handleSubmit}
            >
              {isPending ? (
                <LoadingIcon className="animate-spin text-white-100" />
              ) : (
                confirmButtonLabel
              )}
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  )
}

export { DeleteAddressAlert }
