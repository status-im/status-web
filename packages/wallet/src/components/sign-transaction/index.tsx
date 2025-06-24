'use client'

import { useState, useTransition } from 'react'

import * as AlertDialog from '@radix-ui/react-alert-dialog'
import { Button } from '@status-im/components'
import { CloseIcon, LoadingIcon } from '@status-im/icons/20'
import { FormProvider, useForm } from 'react-hook-form'

import { PasswordInput } from '../password-input'

type Props = {
  onConfirm: (password: string) => void
  children: React.ReactNode
  description?: string
}

export function SignTransactionDialog({
  children,
  onConfirm,
  description = 'To sign transaction',
}: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleConfirm = async (data: { password: string }) => {
    try {
      startTransition(async () => {
        onConfirm(data.password)
        setIsOpen(false)
      })
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialog.Overlay className="fixed inset-0 z-50 bg-blur-neutral-100/70 opacity-[30%] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%]" />
      <AlertDialog.Trigger asChild>{children}</AlertDialog.Trigger>

      <AlertDialog.Content className="fixed left-1/2 top-1/2 z-50 flex min-h-[250px] w-full max-w-[440px] flex-1 -translate-x-1/2 -translate-y-1/2 flex-col rounded-20 bg-white-100 p-4 shadow-1 duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-[0%] data-[state=open]:fade-in-[0%] data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
        <AlertDialog.Cancel className="absolute right-3 top-3 z-40 rounded-10 border border-neutral-30 p-1.5 transition-colors active:border-neutral-50 hover:border-neutral-40 disabled:pointer-events-none">
          <span className="sr-only">Close</span>
          <CloseIcon className="text-neutral-100" />
        </AlertDialog.Cancel>
        <div className="flex flex-col gap-1 pb-4">
          <AlertDialog.Title className="text-27 font-600 text-neutral-100">
            Enter password
          </AlertDialog.Title>
          <AlertDialog.Description className="text-15 text-neutral-50">
            {description}
          </AlertDialog.Description>
        </div>
        <SignTransactionForm onConfirm={handleConfirm} loading={isPending} />
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

type SignTransactionFormProps = {
  onConfirm: (data: { password: string }) => Promise<void>
  loading: boolean
}

function SignTransactionForm({ onConfirm, loading }: SignTransactionFormProps) {
  const form = useForm({
    mode: 'onChange',
    defaultValues: {
      password: '',
    },
  })

  const handleSubmit = async (data: { password: string }) => {
    await onConfirm(data)
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-1 flex-col"
      >
        <PasswordInput
          name="password"
          label="Password"
          placeholder="Type password"
        />
        <div className="mt-auto flex flex-col">
          <Button
            type="submit"
            variant="primary"
            disabled={!form.watch('password') || loading}
          >
            {loading ? (
              <LoadingIcon className="animate-spin text-white-100" />
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  )
}
