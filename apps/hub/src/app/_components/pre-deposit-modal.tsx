'use client'

import { type Dispatch, type SetStateAction, useMemo } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@status-im/components'
import { DropdownIcon } from '@status-im/icons/20'
import { Button, DropdownMenu } from '@status-im/status-network/components'
import { cva } from 'cva'
import Image from 'next/image'
import { useForm, useWatch } from 'react-hook-form'
import { match, P } from 'ts-pattern'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { z } from 'zod'

import { KarmaCircleIcon, PercentIcon, PlusIcon } from '~components/icons/index'
import { type Vault } from '~constants/index'
import { useApproveToken } from '~hooks/useApprovePreDepositToken'
import { useDepositFlow } from '~hooks/useDepositFlow'
import { useExchangeRate } from '~hooks/useExchangeRate'
import { usePreDepositVault } from '~hooks/usePreDepositVault'
import { useVaultsAPY } from '~hooks/useVaultsAPY'
import { useWrapETH } from '~hooks/useWrapETH'
import { formatCurrency, formatTokenAmount } from '~utils/currency'

import { VaultImage } from './vault-image'
import { BaseVaultModal } from './vaults/modals/base-vault-modal'

const MAX_USD_VALUE = 1_000_000_000_000

type PreDepositModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vault: Vault
  vaults: Vault[]
  setActiveVault: Dispatch<SetStateAction<Vault | null>>
  onDepositSuccess?: () => void
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
  onDepositSuccess,
}: PreDepositModalProps) => {
  const toast = useToast()
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
  const { mutate: wrapETH, isPending: isWrapping } = useWrapETH()

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

  const { data: apyMap } = useVaultsAPY()
  const dynamicApy = apyMap?.[vault.address.toLowerCase()]
  const apyValue = dynamicApy !== undefined ? String(dynamicApy) : null

  const amountInUSD = useMemo(() => {
    const amountInputNumber = parseFloat(amountValue || '0')
    const calculatedUSD = amountInputNumber * (exchangeRate?.price ?? 0)

    return match({ exchangeRate, amountInputNumber, calculatedUSD })
      .with({ exchangeRate: P.nullish }, () => 0)
      .with({ amountInputNumber: P.when(n => isNaN(n) || n <= 0) }, () => 0)
      .with({ calculatedUSD: P.when(n => !isFinite(n)) }, () => null)
      .with({ calculatedUSD: P.when(n => n > MAX_USD_VALUE) }, () => null)
      .otherwise(({ calculatedUSD }) => calculatedUSD)
  }, [amountValue, exchangeRate])

  const {
    actionState,
    balance,
    ethBalance,
    maxDeposit,
    minDeposit,
    sharesValidation,
    refetchAllowance,
    refetchBalances,
  } = useDepositFlow({ vault, amountWei, address })

  const isWrongChain = useMemo(() => {
    if (!vault || !chainId) return false
    return vault.chainId !== chainId
  }, [vault, chainId])

  if (!vault) return null

  const handleSubmit = (data: FormValues) => {
    if (!vault || !address || isWrongChain) return

    match(actionState)
      .with('needs-wrap', () => {
        const wethNeeded = amountWei > balance ? amountWei - balance : 0n
        const ethToWrap = ethBalance > wethNeeded ? wethNeeded : ethBalance

        wrapETH(
          { amountWei: ethToWrap },
          {
            onSuccess: async () => {
              await refetchBalances()
              toast.positive(
                'ETH wrapped successfully. You can now proceed with deposit.'
              )
            },
            onError: () => {
              toast.negative('Failed to wrap ETH. Please try again.')
            },
          }
        )
      })
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
                {
                  onSuccess: () => {
                    onDepositSuccess?.()
                    onOpenChange(false)
                  },
                  onError: () => {
                    toast.negative('Deposit failed. Please try again.')
                    form.reset()
                  },
                }
              )
            },
          }
        )
      })
      .with('deposit', () => {
        preDeposit(
          { amount: data.amount, vault },
          {
            onSuccess: () => {
              onDepositSuccess?.()
              onOpenChange(false)
            },
            onError: () => {
              toast.negative('Deposit failed. Please try again.')
              form.reset()
            },
          }
        )
      })
      .otherwise(() => {})
  }

  const handleSetMax = () => {
    let maxAmount = balance ?? 0n
    if (maxDeposit && maxAmount > maxDeposit) maxAmount = maxDeposit
    form.setValue('amount', formatUnits(maxAmount, vault.token.decimals))
  }

  const isPending = isApproving || isDepositing || isWrapping

  const isInputError = match(actionState)
    .with(
      P.union('invalid-balance', 'exceeds-max', 'below-min', 'invalid-shares'),
      () => true
    )
    .otherwise(() => false)

  const errorMessage = match(actionState)
    .with('invalid-balance', () => {
      const totalBalance =
        vault.id === 'WETH'
          ? (balance ?? 0n) + (ethBalance ?? 0n)
          : (balance ?? 0n)
      return `Insufficient balance. Max: ${formatTokenAmount(totalBalance, vault.token.symbol)}`
    })
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
    <BaseVaultModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => form.reset()}
      title="Deposit funds"
      description="Deposit funds for yield and rewards"
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4 px-4 pb-4">
          {/* Vault info */}
          <div className="">
            <div className="text-13 font-500 text-neutral-50">Select token</div>
            <DropdownMenu.Root modal>
              <button
                type="button"
                className="flex w-full items-center justify-between gap-2 rounded-12 border border-neutral-20 bg-white-100 px-3 py-[9px]"
              >
                <div className="flex items-center justify-center gap-2">
                  <Image
                    src={`/vaults/${vault?.icon.toLowerCase()}.png`}
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
                    icon={v.icon.toLowerCase()}
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
                    vault={vault.icon}
                    network={vault.network}
                    size="32"
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

              <div className="space-y-0.5 text-13 font-500 text-neutral-50">
                <div className="flex items-center justify-between">
                  <span>{amountInUSD ? formatCurrency(amountInUSD) : '—'}</span>
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={handleSetMax}
                    className="uppercase hover:text-neutral-80"
                  >
                    MAX{' '}
                    {formatTokenAmount(balance, vault.token.symbol, {
                      includeSymbol: true,
                    })}
                  </button>
                </div>
                {vault.id === 'WETH' && (
                  <div className="text-right">
                    <span>
                      Available ETH to wrap:{' '}
                      {formatTokenAmount(ethBalance, 'ETH')}
                    </span>
                  </div>
                )}
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
            <p className="mb-2 text-13 font-500 text-neutral-50">Rewards</p>
            <div className="flex flex-col flex-wrap gap-4">
              <div className="flex items-center gap-2 text-15">
                <span className="text-purple">
                  <KarmaCircleIcon />
                </span>
                <span className="text-neutral-100">KARMA</span>
              </div>
              <div className="flex items-center gap-2 text-15">
                <span className="text-neutral-50">
                  <PercentIcon />
                </span>
                <span className="text-neutral-100">
                  {apyValue ? `${apyValue}% liquid APY` : 'Liquid APY TBD'}
                </span>
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
                disabled={isPending || isInputError || actionState === 'idle'}
              >
                {match({
                  action: actionState,
                  isApproving,
                  isDepositing,
                  isWrapping,
                })
                  .with({ isWrapping: true }, () => 'Wrapping ETH...')
                  .with({ isApproving: true }, () => 'Approving...')
                  .with({ isDepositing: true }, () => 'Depositing...')
                  .with({ action: 'needs-wrap' }, () => 'Wrap ETH to WETH')
                  .with({ action: 'approve' }, () => 'Approve Deposit')
                  .with({ action: 'deposit' }, () => 'Deposit')
                  .otherwise(() => 'Enter amount')}
              </Button>
            )}
          </div>
        </div>
      </form>
    </BaseVaultModal>
  )
}

export { PreDepositModal }
