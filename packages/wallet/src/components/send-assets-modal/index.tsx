'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Button, Input } from '@status-im/components'
import { AlertIcon, CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { cx } from 'cva'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import type React from 'react'

const formSchema = z.object({
  to: z
    .string()
    .min(1, 'Recipient address is required')
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
  amount: z.string().min(1, 'Amount is required'),
  contractAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
})

type FormData = z.infer<typeof formSchema>

type Props = {
  children: React.ReactNode
  asset: {
    name: string
    icon: string
  }
}

const SendAssetsModal = (props: Props) => {
  const { children, asset } = props
  const [open, setOpen] = useState(false)
  const [errorState, setErrorState] = useState<
    'insufficient-balance' | 'insufficient-gas' | null
  >(null)

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // TODO: Delete this when integrating with actual wallet
      to: '0x39cf6E0Ba4C4530735616e1Ee7ff5FbCB726fBd3',
      amount: '',
      contractAddress: '0x62cD9A9c5bD68c482cB830248570Ac6b54dF6Bd2',
    },
  })

  const watchedAmount = watch('amount')
  const watchedTo = watch('to')
  // TODO: Replace with actual balance and gas estimation logic from props
  const balance = 897349.63
  const balanceEur = 234.46
  const maxFees = 1.45
  const gasFeesEth = 166.7

  const onSubmit = (data: FormData) => {
    const amount = Number.parseFloat(data.amount)

    if (amount > balance) {
      setErrorState('insufficient-balance')
      return
    }

    // TODO: Replace with actual gas estimation logic
    if (amount > 100) {
      setErrorState('insufficient-gas')
      return
    }

    setErrorState(null)
    console.log('Form submitted:', data)
  }

  const handleMaxClick = () => {
    setValue('amount', balance.toString())
  }

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      reset()
      setErrorState(null)
    }
  }

  const hasInsufficientBalance = errorState === 'insufficient-balance'
  const hasInsufficientGas = errorState === 'insufficient-gas'

  return (
    <Dialog.Root open={open} onOpenChange={handleOnOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay
          className={cx(
            'fixed inset-0 bg-blur-neutral-100/70 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in',
          )}
        />
        <Dialog.Content
          data-customisation="blue"
          className={cx([
            'fixed inset-x-0 left-3 top-3 flex size-full justify-center',
          ])}
        >
          <div className="shadow fixed z-auto flex h-[calc(100vh-24px)] w-[calc(100%-23px)] max-w-[423px] flex-col gap-3 rounded-16 border border-neutral-10 bg-white-100 opacity-[1] transition data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in">
            <div className="flex items-center justify-between p-4">
              <Dialog.Title className="text-27 font-semibold">
                Send assets
              </Dialog.Title>

              <Dialog.Close asChild>
                <Button
                  icon={<CloseIcon />}
                  aria-label="Close"
                  variant="outline"
                  size="32"
                />
              </Dialog.Close>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-6 px-6 pb-6"
            >
              <div className="space-y-2">
                <Label htmlFor="to" className="text-13 font-medium">
                  To
                </Label>
                <div className="relative">
                  <Controller
                    name="to"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="to"
                        {...field}
                        className="pr-8 font-mono text-13"
                        placeholder="0x..."
                        clearable={!!watchedTo}
                      />
                    )}
                  />
                </div>
                {errors.to && (
                  <p className="text-13 text-danger-50">{errors.to.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount" className="text-13 font-medium">
                  Amount
                </Label>
                <div className="relative">
                  <Controller
                    name="amount"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="amount"
                        {...field}
                        placeholder="0"
                        className={cx([
                          'pr-20 text-27 font-medium',
                          hasInsufficientBalance &&
                            'border-danger-50 text-danger-50',
                        ])}
                      />
                    )}
                  />
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2">
                    <div className="flex items-center gap-1">
                      <div className="flex size-6 items-center justify-center rounded-full bg-customisation-blue-50">
                        <span className="text-13 font-bold text-white-100">
                          S
                        </span>
                      </div>
                      <span className="font-medium">SNT</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={handleMaxClick}
                      className="h-6 px-2 text-13"
                    >
                      MAX
                    </Button>
                  </div>
                </div>

                <div className="flex justify-between text-13">
                  <span>
                    €
                    {watchedAmount
                      ? (
                          Number.parseFloat(watchedAmount || '0') *
                          (balanceEur / balance)
                        ).toFixed(2)
                      : '0'}
                  </span>
                  <span>
                    {balance.toLocaleString()} SNT / €{balanceEur}
                  </span>
                </div>

                {hasInsufficientBalance && (
                  <Alert variant="destructive">
                    <p className="text-danger-50">
                      More than available balance
                    </p>
                  </Alert>
                )}

                {watchedAmount && !hasInsufficientBalance && (
                  <p className="text-13">
                    Remaining ~{' '}
                    {(
                      balance - Number.parseFloat(watchedAmount || '0')
                    ).toLocaleString()}{' '}
                    SNT / €
                    {(
                      (balance - Number.parseFloat(watchedAmount || '0')) *
                      (balanceEur / balance)
                    ).toFixed(2)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-13 font-medium">From</p>
                <div className="flex items-center gap-3 rounded-16 border p-3">
                  <img
                    className="size-8 rounded-full"
                    alt={asset.name}
                    src={asset.icon}
                  />
                  <div>
                    <p className="font-medium">Account 1</p>
                    <p className="font-mono text-13">0x41b...72h</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="contractAddress"
                  className="text-13 font-medium"
                >
                  Contract address
                </Label>
                <div className="relative">
                  <Controller
                    name="contractAddress"
                    control={control}
                    render={({ field }) => (
                      <Input
                        id="contractAddress"
                        {...field}
                        className="pr-8 font-mono text-13"
                        isReadOnly
                      />
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="absolute right-1 top-1 size-6"
                  >
                    <ExternalIcon className="size-3" />
                  </Button>
                </div>
                {errors.contractAddress && (
                  <p className="text-13 text-danger-50">
                    {errors.contractAddress.message}
                  </p>
                )}
              </div>

              {hasInsufficientGas && (
                <Alert variant="destructive">
                  <div className="flex items-center justify-between">
                    <span className="text-danger-50">
                      Not enough ETH to pay gas fees
                    </span>
                    <Button variant="ghost" className="ml-2">
                      Add ETH
                    </Button>
                  </div>
                </Alert>
              )}

              <div className="flex items-center justify-between pt-4">
                <div>
                  <p className="text-13">Max fees</p>
                  <p
                    className={cx([
                      'font-medium',
                      hasInsufficientGas && 'text-danger-50',
                    ])}
                  >
                    €{hasInsufficientGas ? gasFeesEth : maxFees}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-13">Estimated</p>
                  <p className="font-medium">~60s</p>
                </div>
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={hasInsufficientBalance || hasInsufficientGas}
              >
                Sign Transaction
              </Button>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { SendAssetsModal }

const Alert = ({
  variant,
  className,
  children,
}: {
  variant: 'destructive' | 'default'
  className?: string
  children?: React.ReactNode
}) => (
  <div
    className={cx(
      'flex items-center gap-2 rounded-16 p-3 text-13',
      variant === 'destructive' && 'border border-danger-50 bg-danger-50',
      className,
    )}
  >
    <AlertIcon className="size-4" />
    <span
      className={cx(
        'text-neutral-100',
        variant === 'destructive' && 'text-danger-50',
      )}
    >
      {children}
    </span>
  </div>
)

const Label = ({
  htmlFor,
  children,
  className,
}: {
  htmlFor: string
  children: React.ReactNode
  className?: string
}) => (
  <label
    htmlFor={htmlFor}
    className={cx('block text-13 font-medium text-neutral-100', className)}
  >
    {children}
  </label>
)
