'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { Avatar, Button, Input, useToast } from '@status-im/components'
import { AlertIcon, CloseIcon, ExternalIcon } from '@status-im/icons/20'
import { cx } from 'cva'
import { Controller, useForm } from 'react-hook-form'
import * as z from 'zod'

import { CurrencyAmount } from '../currency-amount'
import { NetworkLogo } from '../network-logo'
import { PasswordModal } from '../password-modal'

import type { NetworkType } from '../../data'
import type { Account } from '../address'
import type React from 'react'

type Props = {
  children: React.ReactNode
  account: Account & {
    ethBalance: number
  }
  asset: {
    name: string
    icon: string
    symbol: string
    totalBalance: number
    totalBalanceEur: number
    contractAddress?: string
    network: NetworkType
  }
  signTransaction: (data: FormData & { password: string }) => Promise<string>
  verifyPassword: (inputPassword: string) => Promise<boolean>
  onEstimateGas: (to: string, value: string) => void
  gasFees?: {
    maxFeeEur: number
    confirmationTime: string
    feeEth: number
  }
  isLoadingFees?: boolean
}

type TransactionState = 'idle' | 'signing' | 'pending' | 'success' | 'error'

const createFormSchema = (balance: number) =>
  z.object({
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
      .optional()
      .refine(
        val => !val || /^0x[a-fA-F0-9]{40}$/.test(val),
        'Invalid contract address',
      ),
  })

type FormData = z.infer<ReturnType<typeof createFormSchema>>

const SendAssetsModal = (props: Props) => {
  const {
    children,
    asset,
    account,
    signTransaction,
    verifyPassword,
    onEstimateGas,
    gasFees,
    isLoadingFees,
  } = props
  const [open, setOpen] = useState(false)
  const [hasInsufficientEth, setHasInsufficientEth] = useState(false)
  const [transactionState, setTransactionState] =
    useState<TransactionState>('idle')
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [pendingTransactionData, setPendingTransactionData] =
    useState<FormData | null>(null)

  const toast = useToast()
  const balance = asset.totalBalance
  const ethBalance = account.ethBalance

  const formSchema = useMemo(() => createFormSchema(balance), [balance])

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
      to: '',
      amount: '',
      contractAddress: asset.contractAddress || undefined,
    },
  })

  const watchedAmount = watch('amount')
  const watchedTo = watch('to')
  const balanceEur = asset.totalBalanceEur

  const debounceTimeout = useRef<NodeJS.Timeout | null>(null)

  const memoizedOnEstimateGas = useRef(onEstimateGas)

  // Estimate gas fees when 'to' or 'amount' changes
  useEffect(() => {
    if (!watchedTo || !watchedAmount) return

    const parsed = Number.parseFloat(watchedAmount)
    if (Number.isNaN(parsed)) return

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current)
    }

    debounceTimeout.current = setTimeout(() => {
      const amountInWei = BigInt(Math.floor(parsed * 1e18)).toString(16)
      memoizedOnEstimateGas.current(watchedTo, `0x${amountInWei}`)
    }, 300)

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current)
        debounceTimeout.current = null
      }
    }
  }, [watchedTo, watchedAmount])

  //  Check for insufficient ETH balance
  useEffect(() => {
    if (!watchedAmount || !gasFees?.feeEth) {
      if (hasInsufficientEth) {
        setHasInsufficientEth(false)
      }
      return
    }

    const isETH = !asset.contractAddress || asset.symbol === 'ETH'
    const amountToSend = Number.parseFloat(watchedAmount)

    const hasInsufficientEthNow = isETH
      ? ethBalance < amountToSend + gasFees.feeEth
      : ethBalance < gasFees.feeEth

    if (hasInsufficientEthNow) {
      if (!hasInsufficientEth) {
        setHasInsufficientEth(true)
      }
    } else if (hasInsufficientEth) {
      setHasInsufficientEth(false)
    }
  }, [
    watchedAmount,
    gasFees,
    ethBalance,
    asset.contractAddress,
    hasInsufficientEth,
    asset.symbol,
  ])

  const onSubmit = async (data: FormData) => {
    setPendingTransactionData(data)
    setShowPasswordModal(true)
  }

  const handlePasswordConfirm = async (password: string) => {
    setTransactionState('signing')

    try {
      const isValid = await verifyPassword(password)

      if (!isValid) {
        setTransactionState('idle')
        throw new Error('Invalid password')
      }

      setShowPasswordModal(false)
      setTransactionState('pending')

      if (pendingTransactionData) {
        toast.positive('Transaction signed', {
          duration: 2000,
        })

        handleOnOpenChange(false)

        await signTransaction({
          ...pendingTransactionData,
          password,
        })

        setTransactionState('success')

        setTimeout(() => {
          toast.positive('Transaction successful')
        }, 5000)
      }
    } catch (error) {
      setTransactionState('error')
      if (error instanceof Error && error.message !== 'Invalid password') {
        setShowPasswordModal(false)
      }

      setTimeout(() => {
        setTransactionState('idle')
      }, 3000)

      throw error
    }
  }

  const handlePasswordModalClose = () => {
    setShowPasswordModal(false)
    setTransactionState('idle')
    setPendingTransactionData(null)
  }

  const handleOnOpenChange = (open: boolean) => {
    setOpen(open)
    if (!open) {
      reset()
      setHasInsufficientEth(false)
      setTransactionState('idle')
      setShowPasswordModal(false)
      setPendingTransactionData(null)
    }
  }

  const hasInsufficientBalance =
    watchedAmount && Number.parseFloat(watchedAmount) > balance

  const isTransactionSigning = transactionState === 'signing'

  return (
    <>
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
            className="fixed left-0 top-[38px] flex size-full justify-center"
          >
            <div className="shadow fixed z-auto flex h-[calc(100vh-76px)] w-[calc(100%-23px)] max-w-[423px] flex-col gap-3 overflow-auto rounded-16 border border-neutral-10 bg-white-100 opacity-[1] transition data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:fade-in">
              <div className="flex items-center justify-between p-4">
                <Dialog.Title className="text-27 font-semibold">
                  Send assets
                </Dialog.Title>
                <Dialog.Description className="hidden">
                  Send {asset.name} to another wallet
                </Dialog.Description>

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
                            step="any"
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
                          <CurrencyAmount
                            value={balanceEur}
                            format="standard"
                          />
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
                      <div className="mt-2 flex items-center gap-1 text-13 font-medium text-neutral-50">
                        Remaining ~{' '}
                        {(
                          balance - Number.parseFloat(watchedAmount || '0')
                        ).toLocaleString()}{' '}
                        {asset.symbol} /{' '}
                        <CurrencyAmount
                          value={
                            balanceEur -
                            Number.parseFloat(watchedAmount || '0') *
                              (balanceEur / balance)
                          }
                          format="standard"
                        />
                      </div>
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
                      <div className="flex-1">
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

                  {/* Contract Address Section */}
                  {asset.contractAddress && (
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
                    </div>
                  )}
                </div>

                <div className="flex w-full flex-col">
                  {hasInsufficientEth && watchedAmount && (
                    <Alert variant="destructive">
                      <div className="flex w-full items-center justify-between">
                        <p className="w-full flex-1">
                          Not enough ETH to pay gas fees
                        </p>
                        <Button variant="danger" size="24" className="ml-2">
                          Add ETH
                        </Button>
                      </div>
                    </Alert>
                  )}
                  {/* Gas Fees Section */}
                  {watchedTo && watchedAmount && (
                    <div className="mb-4 flex items-center justify-between text-13">
                      <div>
                        <p className="text-neutral-50">Max fees</p>
                        <div>
                          {gasFees ? (
                            <>
                              <CurrencyAmount
                                value={gasFees.maxFeeEur}
                                format="precise"
                              />{' '}
                            </>
                          ) : (
                            'Estimating...'
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-neutral-50"> Estimated </p>
                        <p>{gasFees?.confirmationTime || '-'}</p>
                      </div>
                    </div>
                  )}

                  <Button
                    variant="primary"
                    type="submit"
                    disabled={
                      hasInsufficientBalance ||
                      hasInsufficientEth ||
                      !watchedAmount ||
                      !watchedTo ||
                      !gasFees ||
                      isLoadingFees
                    }
                  >
                    Sign Transaction
                  </Button>
                </div>
              </form>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Password Verification Modal */}
      <PasswordModal
        open={showPasswordModal}
        onOpenChange={handlePasswordModalClose}
        onConfirm={handlePasswordConfirm}
        isLoading={isTransactionSigning}
        buttonLabel="Sign Transaction"
      />
    </>
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
      '-mx-4 flex w-[calc(100%+32px)] items-center gap-2 p-3 text-13',
      variant === 'destructive' &&
        'bg-gradient-to-b from-danger-50/5 to-[transparent]',
      className,
    )}
  >
    <AlertIcon className="size-4 text-danger-50" />
    <span
      className={cx(variant === 'destructive' && 'text-danger-50', 'flex-1')}
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

export type { FormData as SendAssetsFormData }
export type SendAssetsModalProps = Omit<Props, 'signTransaction'> & {
  signTransaction: (data: FormData & { password: string }) => Promise<string>
}
