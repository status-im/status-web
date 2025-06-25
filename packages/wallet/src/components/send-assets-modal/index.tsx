'use client'

import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Avatar, Button, Input } from '@status-im/components'
import { AlertIcon, CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { cx } from 'cva'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { CurrencyAmount } from '../currency-amount'
// import { NetworkType } from '../../data'
import { NetworkLogo } from '../network-logo'

import type { NetworkType } from '../../data'
import type { Account } from '../address'
import type React from 'react'

type Props = {
  children: React.ReactNode
  account: Account
  asset: {
    name: string
    icon: string
    symbol: string
    totalBalance: number
    totalBalanceEur: number
    contractAddress?: string
    network: NetworkType
  }
}

const SendAssetsModal = (props: Props) => {
  const { children, asset, account } = props
  const [open, setOpen] = useState(false)
  const [errorState, setErrorState] = useState<'insufficient-gas' | null>(null)

  const balance = asset.totalBalance

  const formSchema = z.object({
    to: z
      .string()
      .min(1, 'Recipient address is required')
      .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid wallet address'),
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine(
        val => {
          const num = Number.parseFloat(val)
          return num > 0 && num <= balance
        },
        {
          message: 'More than available balance',
        },
      ),
    contractAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid contract address'),
  })

  type FormData = z.infer<typeof formSchema>

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: 'all',
    defaultValues: {
      // TODO: Delete this when integrating with actual wallet
      to: '0x39cf6E0Ba4C4530735616e1Ee7ff5FbCB726fBd3',
      amount: '',
      contractAddress: asset.contractAddress || '',
    },
  })

  const watchedAmount = watch('amount')
  const watchedTo = watch('to')
  // TODO: Replace with actual balance and gas estimation logic from props
  const balanceEur = asset.totalBalanceEur
  const maxFees = 1.45
  const gasFeesEth = 166.7

  const onSubmit = (data: FormData) => {
    const amount = Number.parseFloat(data.amount)

    // TODO: Replace with actual gas estimation logic
    if (amount > 100) {
      setErrorState('insufficient-gas')
      return
    }

    setErrorState(null)
    console.log('Form submitted:', data)
  }

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      reset()
      setErrorState(null)
    }
  }

  const hasInsufficientBalance =
    watchedAmount && Number.parseFloat(watchedAmount) > balance
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
          className="fixed left-0 top-3 flex size-full justify-center"
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
              className="flex h-full flex-col place-content-between content-between justify-between space-y-6 px-4 pb-4"
            >
              <div>
                <div className="mb-2 mt-4">
                  <Label htmlFor="to">To</Label>
                  <div className="relative mt-2">
                    <Controller
                      name="to"
                      control={control}
                      render={({ field }) => (
                        <Input
                          id="to"
                          {...field}
                          isInvalid={!!errors.to}
                          className="pr-8 font-mono text-13"
                          placeholder="0x..."
                          clearable={!!watchedTo}
                        />
                      )}
                    />
                  </div>
                  {errors.to && (
                    <div className="mt-2 flex items-center gap-1 text-13 text-danger-50">
                      <AlertIcon className="size-4" />
                      <p>{errors.to.message}</p>
                    </div>
                  )}
                </div>

                <div className="mb-2 mt-4">
                  <Label htmlFor="amount">Amount</Label>
                  <div
                    className={cx([
                      'relative block w-full min-w-0 flex-1 overflow-hidden border border-neutral-20 bg-white-100 text-15 text-neutral-100 placeholder-neutral-40 max-sm:text-[1rem]',
                      'outline-none focus:border-neutral-40',
                      'rounded-12',
                      'mt-2',
                    ])}
                  >
                    <Controller
                      name="amount"
                      control={control}
                      render={({ field }) => (
                        <input
                          id="amount"
                          {...field}
                          type="number"
                          min={0}
                          placeholder="0"
                          className={cx([
                            'w-full px-4 py-3 text-27 font-medium',
                            '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
                            hasInsufficientBalance && 'text-danger-50',
                          ])}
                        />
                      )}
                    />

                    <div className="absolute right-4 top-3 flex items-center gap-2">
                      <div className="relative">
                        <img
                          className="size-8 rounded-full"
                          alt={asset.name}
                          src={asset.icon}
                        />
                        <div className="absolute bottom-[-3px] right-[-3px] rounded-full border-2 border-white-100">
                          <NetworkLogo name={asset.network} size={12} />
                        </div>
                      </div>
                      <span className="text-19 font-600">{asset.symbol}</span>
                    </div>

                    <div className="h-px w-full bg-neutral-20" />
                    <div className="flex justify-between px-4 py-3 text-13 font-medium">
                      <span className="text-neutral-50">
                        €
                        {watchedAmount
                          ? Number.parseFloat(watchedAmount || '0') *
                            (balanceEur / balance)
                          : '0'}
                      </span>
                      <span
                        className={cx([
                          'flex items-center gap-1',
                          hasInsufficientBalance && 'text-danger-50',
                        ])}
                      >
                        {balance.toLocaleString()} {asset.symbol} /{' '}
                        <CurrencyAmount value={balanceEur} format="standard" />
                      </span>
                    </div>
                  </div>

                  {errors.amount && (
                    <div className="mt-2 flex items-center gap-1 text-13 text-danger-50">
                      <AlertIcon className="size-4" />
                      <p>{errors.amount.message}</p>
                    </div>
                  )}

                  {watchedAmount && !hasInsufficientBalance && (
                    <p className="mt-6 text-13 font-medium text-neutral-50">
                      Remaining:{' '}
                      {(
                        balance - Number.parseFloat(watchedAmount || '0')
                      ).toLocaleString()}{' '}
                      {asset.symbol}
                    </p>
                  )}
                </div>

                <div className="mt-6">
                  <p className="mb-2 text-13 font-medium text-neutral-50">
                    From
                  </p>
                  <div
                    className="flex items-center gap-1.5 rounded-16 border border-neutral-10 px-3 py-2"
                    data-customisation={account.color}
                  >
                    <Avatar
                      type="account"
                      name={account.name}
                      emoji={account.emoji}
                      size="32"
                      bgOpacity="20"
                    />
                    <div>
                      <div className="text-15 font-semibold text-neutral-100">
                        {account.name}
                      </div>

                      <span className="text-13 font-medium text-neutral-50">
                        {account.address.slice(0, 6)}...
                        {account.address.slice(-3)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Label
                    htmlFor="contractAddress"
                    className="mb-2 text-13 font-medium"
                  >
                    Contract address
                  </Label>

                  <Controller
                    name="contractAddress"
                    control={control}
                    render={({ field }) => (
                      <div className="relative flex items-center justify-between gap-1.5 rounded-16 border border-neutral-10 px-3 py-2 text-13">
                        <input
                          id="contractAddress"
                          {...field}
                          className="w-full"
                          readOnly
                        />
                        <a
                          href={`https://etherscan.io/token/${asset.contractAddress}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="View contract on Etherscan"
                          className="text-neutral-50 hover:text-neutral-60"
                        >
                          <ExternalIcon />
                        </a>
                      </div>
                    )}
                  />

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
              </div>

              <Button
                variant="primary"
                type="submit"
                disabled={
                  hasInsufficientBalance ||
                  hasInsufficientGas ||
                  !watchedAmount ||
                  !watchedTo
                }
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
    className={cx('block text-13 font-medium text-neutral-50', className)}
  >
    {children}
  </label>
)
