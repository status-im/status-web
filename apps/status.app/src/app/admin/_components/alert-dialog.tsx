'use client'

import { useState, useTransition } from 'react'

import * as AlertDialogPrimitive from '@radix-ui/react-alert-dialog'
import { LoadingIcon } from '@status-im/icons/20'
import { cva, cx } from 'class-variance-authority'

// COMPONENTS FROM RADIX UI
const AlertDialogRoot = AlertDialogPrimitive.Root
const AlertDialogTrigger = AlertDialogPrimitive.Trigger
const AlertDialogPortal = AlertDialogPrimitive.Portal
const AlertDialogOverlay = AlertDialogPrimitive.Overlay
const AlertDialogContent = AlertDialogPrimitive.Content
// const AlertDialogAction = AlertDialogPrimitive.Action
const AlertDialogCancel = AlertDialogPrimitive.Cancel
const AlertDialogTitle = AlertDialogPrimitive.Title

const AlertDialogHeader = (props: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cx('flex flex-col text-left')} {...props} />
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
  }
)

// ALERT DIALOG
const AlertDialog = (props: {
  title: string
  children: React.ReactNode
  onConfirm: () => Promise<unknown>
}) => {
  const { title, children, onConfirm } = props
  const [open, setOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  const handleSubmit = async () => {
    startTransition(async () => {
      await onConfirm()
      setOpen(false)
    })
  }

  return (
    <AlertDialogRoot open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogPortal>
        <AlertDialogOverlay className="fixed inset-0 z-50 bg-blur-neutral-100/70 opacity-[30%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%]" />
        <AlertDialogContent className="fixed left-1/2 top-1/2 z-50 w-full max-w-[352px] -translate-x-1/2 -translate-y-1/2 rounded-20 bg-white-100 p-4 shadow-1 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-19 font-semibold">
              {title}
            </AlertDialogTitle>
            <p className="mt-1 text-15">Are you sure?</p>
            <p className="mb-1 text-15 text-neutral-50">
              This action cannot be undone
            </p>
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
                'Confirm'
              )}
            </button>
          </div>
        </AlertDialogContent>
      </AlertDialogPortal>
    </AlertDialogRoot>
  )
}

export { AlertDialog }
