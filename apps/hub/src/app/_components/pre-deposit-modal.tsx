'use client'

import { type Dispatch, type SetStateAction, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { CloseIcon, DropdownIcon } from '@status-im/icons/20'
import { Button, DropdownMenu } from '@status-im/status-network/components'
import { cva } from 'cva'
import Image from 'next/image'
import { useForm, useWatch } from 'react-hook-form'
import { match, P } from 'ts-pattern'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { z } from 'zod'

import { PercentIcon, PlusIcon } from '~components/icons/index'
import { type Vault } from '~constants/index'
import { useApproveToken } from '~hooks/useApprovePreDepositToken'
import { useDepositFlow } from '~hooks/useDepositFlow'
import { useExchangeRate } from '~hooks/useExchangeRate'
import { usePreDepositVault } from '~hooks/usePreDepositVault'
import { formatCurrency, formatTokenAmount } from '~utils/currency'

import { VaultImage } from './vault-image'

type PreDepositModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vault: Vault
  vaults: Vault[]
  setActiveVault: Dispatch<SetStateAction<Vault | null>>
}

const depositFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
})

type FormValues = z.infer<typeof depositFormSchema>

const inputContainerStyles = cva({
  base: 'rounded-16 border bg-white-100 px-4 py-3 transition-colors',
  variants: {
    state: {
      default: 'border-neutral-20',
      error: 'border-danger-50',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const dividerStyles = cva({
  base: '-mx-4 my-3 h-px w-[calc(100%+32px)] transition-colors',
  variants: {
    state: {
      default: 'bg-neutral-10',
      error: 'bg-danger-50',
    },
  },
  defaultVariants: {
    state: 'default',
  },
})

const PreDepositModal = ({
  open,
  onOpenChange,
  vault,
  vaults,
  setActiveVault,
}: PreDepositModalProps) => {
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()

  const form = useForm<FormValues>({
    resolver: zodResolver(depositFormSchema),
    mode: 'onChange',
    defaultValues: { amount: '' },
  })

  const amountValue = useWatch({ control: form.control, name: 'amount' })

  const { mutate: approveToken, isPending: isApproving } = useApproveToken()
  const { mutate: preDeposit, isPending: isDepositing } = usePreDepositVault()

  const amountWei = useMemo(() => {
    if (!vault || !amountValue) return 0n
    try {
      return parseUnits(amountValue, vault.token.decimals)
    } catch {
      return 0n
    }
  }, [amountValue, vault])

  const { data: exchangeRate } = useExchangeRate({
    token: vault.token.priceKey || vault.token.symbol,
  })

  const amountInUSD = useMemo(() => {
    const amountInputNumber = parseFloat(amountValue || '0')
    const calculatedUSD = amountInputNumber * (exchangeRate?.price ?? 0)

    return match({ exchangeRate, amountInputNumber, calculatedUSD })
      .with({ exchangeRate: P.nullish }, () => 0)
      .with({ amountInputNumber: P.when(n => isNaN(n) || n <= 0) }, () => 0)
      .with({ calculatedUSD: P.when(n => !isFinite(n)) }, () => null)
      .with({ calculatedUSD: P.when(n => n > 1_000_000_000_000) }, () => null)
      .otherwise(({ calculatedUSD }) => calculatedUSD)
  }, [amountValue, exchangeRate])

  const {
    actionState,
    balance,
    maxDeposit,
    minDeposit,
    sharesValidation,
    refetchAllowance,
  } = useDepositFlow({ vault, amountWei, address })

  const isWrongChain = useMemo(() => {
    if (!vault || !chainId) return false
    return vault.chainId !== chainId
  }, [vault, chainId])

  if (!vault) return null

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) form.reset()
    onOpenChange(nextOpen)
  }

  const handleSubmit = (data: FormValues) => {
    if (!vault || !address || isWrongChain) return

    match(actionState)
      .with('approve', () => {
        approveToken(
          {
            token: vault.token,
            amount: data.amount,
            spenderAddress: vault.address,
          },
          {
            onSuccess: async () => {
              await refetchAllowance()
              preDeposit(
                { amount: data.amount, vault },
                { onSuccess: () => onOpenChange(false) }
              )
            },
          }
        )
      })
      .with('deposit', () => {
        preDeposit(
          { amount: data.amount, vault },
          { onSuccess: () => onOpenChange(false) }
        )
      })
      .otherwise(() => {})
  }

  const handleSetMax = () => {
    let maxAmount = balance ?? 0n
    if (maxDeposit && maxAmount > maxDeposit) maxAmount = maxDeposit
    form.setValue('amount', formatUnits(maxAmount, vault.token.decimals))
  }

  const isPending = isApproving || isDepositing

  const isInputError = match(actionState)
    .with(
      P.union('invalid-balance', 'exceeds-max', 'below-min', 'invalid-shares'),
      () => true
    )
    .otherwise(() => false)

  const errorMessage = match(actionState)
    .with(
      'invalid-balance',
      () =>
        `Insufficient balance. Max: ${formatTokenAmount(balance, vault.token.symbol)}`
    )
    .with(
      'exceeds-max',
      () =>
        `Exceeds vault limit. Max: ${formatTokenAmount(maxDeposit ?? 0n, vault.token.symbol)}`
    )
    .with(
      'below-min',
      () =>
        `Below minimum deposit. Min: ${formatTokenAmount(minDeposit ?? 0n, vault.token.symbol)}`
    )
    .with('invalid-shares', () => sharesValidation.validationMessage)
    .otherwise(() => form.formState.errors.amount?.message)

  const warningMessage =
    !isInputError && sharesValidation.validationMessage
      ? sharesValidation.validationMessage
      : null

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="relative mx-auto w-full max-w-[480px] overflow-hidden rounded-20 bg-white-100 shadow-3">
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-3 top-3 z-50 flex size-8 items-center justify-center rounded-10 border border-[rgba(27,39,61,0.1)] backdrop-blur-[20px] transition-colors hover:bg-neutral-10 focus:outline-none"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>

            <div className="box-border flex flex-col items-center px-4 pb-4 pt-8">
              <Dialog.Title asChild>
                <div className="flex w-full items-center gap-[6px]">
                  <span className="min-h-px min-w-px shrink-0 grow basis-0 text-19 font-600 text-neutral-100">
                    Deposit funds
                  </span>
                </div>
              </Dialog.Title>

              <Dialog.Description asChild>
                <div className="flex w-full flex-col justify-center text-15 text-neutral-100">
                  Deposit funds for yield and rewards
                </div>
              </Dialog.Description>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-4 px-4 pb-4">
                {/* Vault info */}
                <div className="">
                  <div className="text-13 font-500 text-neutral-50">
                    Select token
                  </div>
                  <DropdownMenu.Root modal>
                    <button
                      type="button"
                      className="flex w-full items-center justify-between gap-2 rounded-12 border border-neutral-20 bg-white-100 px-3 py-[9px]"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Image
                          src={`/vaults/${vault?.icon}.png`}
                          alt={vault?.icon}
                          width="20"
                          height="20"
                          className="size-5 shrink-0"
                        />
                        <span className="text-15 font-400 text-neutral-100">
                          {vault.token.name}, {vault.token.symbol}
                        </span>
                      </div>
                      <DropdownIcon className="shrink-0 text-neutral-40 transition-transform" />
                    </button>

                    <DropdownMenu.Content>
                      {vaults.map(v => (
                        <DropdownMenu.Item
                          key={v.id}
                          label={`${v.token.name}, ${v.token.symbol}`}
                          selected={v.id === vault.id}
                          onSelect={() => setActiveVault(v)}
                          icon={v.icon}
                        />
                      ))}
                    </DropdownMenu.Content>
                  </DropdownMenu.Root>
                </div>

                {/* Amount input */}
                <div className="space-y-2">
                  <label
                    htmlFor="deposit-amount"
                    className="block text-13 font-500 text-neutral-50"
                  >
                    Amount to deposit
                  </label>

                  <div
                    className={inputContainerStyles({
                      state: isInputError ? 'error' : 'default',
                    })}
                  >
                    <div className="flex items-center justify-between">
                      <input
                        id="deposit-amount"
                        inputMode="decimal"
                        {...form.register('amount')}
                        placeholder="0"
                        disabled={isPending}
                        className="w-full border-none bg-transparent text-27 font-600 text-neutral-100 outline-none placeholder:text-neutral-40"
                      />
                      <div className="flex items-center gap-1">
                        <VaultImage
                          token={vault.token.symbol}
                          vault={vault.icon}
                        />
                        <span className="text-19 font-600 text-neutral-80">
                          {vault.token.symbol}
                        </span>
                      </div>
                    </div>

                    <div
                      className={dividerStyles({
                        state: isInputError ? 'error' : 'default',
                      })}
                    />

                    <div className="flex items-center justify-between text-13 font-500 text-neutral-50">
                      <span>
                        {amountInUSD ? formatCurrency(amountInUSD) : '—'}
                      </span>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={handleSetMax}
                        className="uppercase text-neutral-100 hover:text-neutral-80"
                      >
                        MAX{' '}
                        {formatTokenAmount(balance, vault.token.symbol, {
                          includeSymbol: true,
                        })}
                      </button>
                    </div>
                  </div>

                  {errorMessage && (
                    <p className="text-13 text-danger-50">{errorMessage}</p>
                  )}
                  {warningMessage && (
                    <p className="text-13 text-customisation-yellow-50">
                      {warningMessage}
                    </p>
                  )}
                </div>

                {/* Rewards */}
                <div>
                  <p className="mb-2 text-13 font-500 text-neutral-50">
                    Rewards
                  </p>
                  <div className="flex flex-col flex-wrap gap-4">
                    <div className="flex items-center gap-2 text-15">
                      <span className="text-neutral-50">
                        <PercentIcon />
                      </span>
                      <span className="text-neutral-100">{vault.apy} APY</span>
                    </div>
                    <div className="flex items-center gap-2 text-15">
                      <span className="text-neutral-50">
                        <PlusIcon />
                      </span>
                      <span className="text-neutral-100">
                        {vault.rewards.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full gap-3 pt-4">
                  {isWrongChain ? (
                    <Button
                      type="button"
                      className="w-full justify-center"
                      onClick={() => switchChain({ chainId: vault.chainId })}
                      disabled={isSwitchingChain}
                    >
                      {isSwitchingChain
                        ? 'Switching...'
                        : 'Switch Network to Deposit'}
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      className="w-full justify-center"
                      disabled={
                        isPending || isInputError || actionState === 'idle'
                      }
                    >
                      {match({ action: actionState, isApproving, isDepositing })
                        .with({ isApproving: true }, () => 'Approving...')
                        .with({ isDepositing: true }, () => 'Depositing...')
                        .with({ action: 'approve' }, () => 'Approve Deposit')
                        .with({ action: 'deposit' }, () => 'Deposit')
                        .otherwise(() => 'Enter amount')}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { PreDepositModal }
