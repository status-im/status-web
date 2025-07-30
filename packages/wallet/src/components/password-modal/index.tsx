'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Button, Input } from '@status-im/components'
import { AlertIcon, CloseIcon, HideIcon, RevealIcon } from '@status-im/icons/20'
import { cx } from 'cva'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

const passwordSchema = z.object({
  password: z.string().min(1, 'Password is required'),
})

type PasswordFormData = z.infer<typeof passwordSchema>

type PasswordModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (password: string) => Promise<void>
  isLoading?: boolean
  buttonLabel?: string
}

const PasswordModal = (props: PasswordModalProps) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: '',
    },
  })

  const {
    open,
    onOpenChange,
    onConfirm,
    isLoading = false,
    buttonLabel = 'Confirm',
  } = props

  const [showPassword, setShowPassword] = useState(false)

  const onSubmit = async (data: PasswordFormData) => {
    try {
      await onConfirm(data.password)
      reset()
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Invalid password') {
          setError('password', {
            message: 'Password is incorrect. Try again.',
          })
        } else {
          setError('password', {
            message: 'An error occurred. Please try again.',
          })
        }
      }
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen)
    if (!newOpen) {
      reset()
    }
  }

  const LoadingSpinner = () => (
    <div className="size-5 animate-spin rounded-full border-2 border-white-100 border-t-transparent" />
  )

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cx(
            'fixed inset-0 bg-blur-neutral-100/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
          )}
        />
        <Dialog.Content
          data-customisation="blue"
          className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[24px]"
        >
          <div className="flex min-h-[251px] w-screen max-w-[436px] flex-col rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-3">
            <div className="mb-1 flex items-center justify-between">
              <Dialog.Title className="text-27 font-semibold">
                Enter password
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  icon={<CloseIcon />}
                  aria-label="Close"
                  variant="outline"
                  size="32"
                  disabled={isLoading}
                />
              </Dialog.Close>
            </div>

            <p className="mb-5 text-13 text-neutral-50">To sign transaction</p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex flex-1 flex-col place-content-between content-between justify-between"
            >
              <div className="mb-4 w-full">
                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <div className="relative">
                      <Input
                        {...field}
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Type password"
                        isInvalid={!!errors.password}
                        isDisabled={isLoading}
                        onKeyDown={e => {
                          if (e.key === 'Enter' && !isLoading) {
                            handleSubmit(onSubmit)()
                          }
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-50 hover:text-neutral-70"
                      >
                        {showPassword ? <HideIcon /> : <RevealIcon />}
                      </button>
                    </div>
                  )}
                />

                {errors.password && (
                  <div className="mt-2 flex items-center gap-1 text-13 text-danger-50">
                    <AlertIcon className="size-4" />
                    <p>{errors.password.message}</p>
                  </div>
                )}
              </div>

              <Button
                variant="primary"
                className="w-full flex-1"
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <LoadingSpinner />
                    <span>Signing...</span>
                  </div>
                ) : (
                  buttonLabel
                )}
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { PasswordModal }
