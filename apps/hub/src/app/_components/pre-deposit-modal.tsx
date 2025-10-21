'use client'

import { useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { ContextTag } from '@status-im/components'
import { CloseIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { cva } from 'cva'
import Image from 'next/image'
import { useForm, useWatch } from 'react-hook-form'
import { match, P } from 'ts-pattern'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useBalance, useReadContract } from 'wagmi'
import { z } from 'zod'

import { VaultIcon } from '~components/icons/index'
import { type Vault } from '~constants/index'
import { useApproveToken } from '~hooks/useApprovePreDepositToken'
import { useExchangeRate } from '~hooks/useExchangeRate'
import { useMaxPreDepositValue } from '~hooks/useMaxPreDepositValue'
import { useMinPreDepositValue } from '~hooks/useMinPreDepositValue'
import { usePreDepositVault } from '~hooks/usePreDepositVault'
import { formatCurrency, formatTokenAmount } from '~utils/currency'

import type { allowanceAbi } from '~constants/contracts/AllowanceAbi'
import type { Dispatch, SetStateAction } from 'react'

type PreDepositModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vault: Vault
  setActiveVault: Dispatch<SetStateAction<Vault | null>>
}

const depositFormSchema = z.object({
  amount: z.string().min(1, 'Amount is required'),
})

type FormValues = z.infer<typeof depositFormSchema>

type DepositAction =
  | 'idle'
  | 'approve'
  | 'deposit'
  | 'invalid'
  | 'exceeds-max'
  | 'below-min'

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
}: PreDepositModalProps) => {
  const { address, isConnected } = useAccount()
  // TODO: Replace with useExhangeRate({ token: vault.token.symbol }) before prod
  const { data: exchangeRate } = useExchangeRate()

  const { mutate: approveToken, isPending: isApproving } = useApproveToken()
  const { mutate: preDeposit, isPending: isDepositing } = usePreDepositVault()

  const form = useForm<FormValues>({
    resolver: zodResolver(depositFormSchema),
    mode: 'onChange',
    defaultValues: {
      amount: '',
    },
  })

  // TODO: I've seen a bunch of useBalance around this is deprecated in wagmi in favor of readContract on the ERC20 etc.
  const { data: balance } = useBalance({
    address,
    token: vault?.token.address,
    query: {
      enabled: isConnected && open && !!vault,
    },
  })

  const { data: maxDeposit } = useMaxPreDepositValue({
    vault,
  })

  const { data: minDeposit } = useMinPreDepositValue({
    vault,
  })

  const amountValue = useWatch({
    control: form.control,
    name: 'amount',
    defaultValue: '',
  })

  const { data: currentAllowance, refetch } = useReadContract({
    address: vault?.token.address,
    abi: vault?.token.abi as typeof allowanceAbi,
    functionName: 'allowance',
    args: address && vault ? [address, vault.address] : undefined,
    query: {
      enabled: isConnected && open && !!vault && !!address,
    },
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

  const depositAction = useMemo(() => {
    if (!vault || !balance || !amountValue || amountValue.trim() === '') {
      return 'idle'
    }

    let amountWei: bigint
    try {
      amountWei = parseUnits(amountValue, vault.token.decimals)
    } catch {
      return 'idle'
    }

    if (amountWei <= 0n) return 'idle'

    const allowance: bigint = currentAllowance ?? 0n

    return match({
      amountWei,
      balance: balance.value,
      allowance,
      maxDeposit,
      minDeposit,
    })
      .returnType<DepositAction>()
      .with({ amountWei: P.when(amt => amt > balance.value) }, () => 'invalid')
      .with(
        {
          maxDeposit: P.not(P.nullish),
          amountWei: P.when(amt => maxDeposit && amt > maxDeposit),
        },
        () => 'exceeds-max'
      )
      .with(
        {
          minDeposit: P.not(P.nullish),
          amountWei: P.when(amt => minDeposit && amt < minDeposit),
        },
        () => 'below-min'
      )
      .with({ amountWei: P.when(amt => amt > allowance) }, () => 'approve')
      .otherwise(() => 'deposit')
  }, [amountValue, balance, vault, currentAllowance, maxDeposit, minDeposit])

  if (!vault) return null

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset()
    }
    onOpenChange(nextOpen)
  }

  const handleSubmit = async (data: FormValues) => {
    if (!vault || !address) return

    const deposit = () => {
      preDeposit(
        { amount: data.amount, vault },
        { onSuccess: () => onOpenChange(false) }
      )
    }

    const approve = () => {
      approveToken(
        {
          token: vault.token,
          amount: data.amount,
          spenderAddress: vault.address,
        },
        {
          async onSuccess() {
            await refetch()
            deposit()
          },
        }
      )
    }

    try {
      match(depositAction)
        .with('approve', approve)
        .with('deposit', deposit)
        .otherwise(() => {})
    } catch (error) {
      console.error('Error during deposit:', error)
      form.setError('amount', {
        type: 'manual',
        message: 'Failed to process deposit',
      })
    }
  }

  const isPending = isApproving || isDepositing

  const formattedBalance = formatTokenAmount(
    balance?.value ?? 0n,
    vault.token.symbol,
    {
      tokenDecimals: vault.token.decimals,
      includeSymbol: true,
    }
  )

  const formattedMaxDeposit = formatTokenAmount(
    maxDeposit ?? 0n,
    vault.token.symbol,
    {
      tokenDecimals: vault.token.decimals,
      includeSymbol: true,
    }
  )

  const formattedMinDeposit = formatTokenAmount(
    minDeposit ?? 0n,
    vault.token.symbol,
    {
      tokenDecimals: vault.token.decimals,
      includeSymbol: true,
    }
  )

  const inputState = match(depositAction)
    .with(
      P.union('invalid', 'exceeds-max', 'below-min'),
      () => 'error' as const
    )
    .otherwise(() => 'default' as const)

  const errorMessage = match(depositAction)
    .with('invalid', () => `Insufficient balance. Maximum: ${formattedBalance}`)
    .with(
      'exceeds-max',
      () => `Exceeds vault limit. Maximum: ${formattedMaxDeposit}`
    )
    .with(
      'below-min',
      () => `Below minimum deposit. Minimum: ${formattedMinDeposit}`
    )
    .otherwise(() => form.formState.errors.amount?.message)

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
                  <span className="min-h-px min-w-px shrink-0 grow basis-0 text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-neutral-100">
                    Deposit to {vault.name}
                  </span>
                </div>
              </Dialog.Title>

              <Dialog.Description asChild>
                <div className="sr-only flex w-full flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-neutral-100">
                  <span className="leading-[1.45]">
                    Earn {vault.apy} APY with rewards
                  </span>
                </div>
              </Dialog.Description>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-4 px-4 pb-4">
                {/* Vault info */}
                <div className="rounded-16 border border-neutral-20 bg-neutral-2.5 p-4">
                  <div className="flex items-center gap-3">
                    <VaultIcon token={vault.token.symbol} vault={vault.icon} />
                    <div>
                      <p className="font-600 text-neutral-90">{vault.name}</p>
                      <p className="text-13 text-neutral-60">
                        APY: {vault.apy}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Amount input */}
                <div className="space-y-2">
                  <label
                    htmlFor="deposit-amount"
                    className="block text-13 font-medium text-neutral-50"
                  >
                    Amount to deposit
                  </label>
                  <div className={inputContainerStyles({ state: inputState })}>
                    <div className="flex items-center justify-between">
                      <input
                        id="deposit-amount"
                        type="text"
                        inputMode="decimal"
                        {...form.register('amount')}
                        placeholder="0"
                        disabled={isPending}
                        className="w-full border-none bg-transparent text-27 font-semibold leading-[38px] text-neutral-100 outline-none placeholder:text-neutral-40"
                      />
                      <div className="flex items-center gap-1">
                        <VaultIcon
                          token={vault.token.symbol}
                          vault={vault.icon}
                        />
                        <span className="text-19 font-semibold text-neutral-80">
                          {vault.token.symbol}
                        </span>
                      </div>
                    </div>
                    <div className={dividerStyles({ state: inputState })} />
                    <div className="flex items-center justify-between text-13 font-500 text-neutral-50">
                      <span>
                        {match(amountInUSD)
                          .with(null, () => '—')
                          .otherwise(usd => formatCurrency(usd))}
                      </span>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          const maxAmount =
                            balance?.value && maxDeposit
                              ? balance.value < maxDeposit
                                ? balance.value
                                : maxDeposit
                              : (balance?.value ?? 0n)

                          form.setValue(
                            'amount',
                            formatUnits(maxAmount, vault.token.decimals)
                          )
                        }}
                        className="uppercase text-neutral-100 transition-colors hover:text-neutral-80"
                      >
                        MAX {formattedBalance}
                      </button>
                    </div>
                  </div>
                  {errorMessage && (
                    <p className="text-13 text-danger-50">{errorMessage}</p>
                  )}
                </div>

                {/* Rewards */}
                <div>
                  <p className="mb-2 text-13 font-500 text-neutral-60">
                    You'll earn rewards in:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {vault.rewards.map(reward => (
                      <ContextTag
                        type="token"
                        label={reward.name}
                        icon={
                          <Image
                            priority
                            width="32"
                            height="32"
                            src={`/vaults/${reward.icon}.png`}
                            alt={reward.name}
                          />
                        }
                        key={reward.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex w-full gap-3 pt-4">
                  <Button
                    type="submit"
                    className="w-full justify-center"
                    disabled={match(depositAction)
                      .with(
                        P.union('idle', 'invalid', 'exceeds-max', 'below-min'),
                        () => true
                      )
                      .otherwise(() => isPending)}
                  >
                    {match({ action: depositAction, isApproving, isDepositing })
                      .with({ isApproving: true }, () => 'Approving...')
                      .with({ isDepositing: true }, () => 'Depositing...')
                      .with({ action: 'approve' }, () => 'Approve Deposit')
                      .with({ action: 'deposit' }, () => 'Deposit')
                      .otherwise(() => 'Enter amount')}
                  </Button>
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
export type { Vault }
