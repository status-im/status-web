import { useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Skeleton } from '@status-im/components'
import { DropdownIcon, UnlockedIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { ConnectKitButton, useSIWE } from 'connectkit'
import { useForm, useWatch } from 'react-hook-form'
import { match } from 'ts-pattern'
import { parseUnits } from 'viem'
import { useAccount, useBalance, useConfig } from 'wagmi'
import { readContract } from 'wagmi/actions'
import { z } from 'zod'

import { SNTIcon } from '~components/icons'
import { PromoModal } from '~components/stake/promo-modal'
import { VaultSelect } from '~components/vault-select'
import { LockVaultModal } from '~components/vaults/modals/lock-vault-modal'
import { STAKE_PAGE_CONSTANTS, STT_TOKEN } from '~constants/index'
import { useApproveToken } from '~hooks/useApproveToken'
import { useCreateVault } from '~hooks/useCreateVault'
import { useExchangeRate } from '~hooks/useExchangeRate'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useStatusWallet } from '~hooks/useStatusWallet'
import { useVaultStateContext } from '~hooks/useVaultStateContext'
import { useVaultTokenStake } from '~hooks/useVaultTokenStake'

import { useEmergencyModeEnabled } from '../../_hooks/useEmergencyModeEnabled'
import { StakeAmountInput } from './stake-amount-input'

import type { Address } from 'viem'

const LOCK_VAULT_ACTIONS = [{ label: "Don't lock" }, { label: 'Lock' }] as const

const StakeFormSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-2 md:rounded-32 md:p-8">
      <div className="flex flex-1 flex-col gap-4">
        <div className="space-y-2">
          <label
            htmlFor="stake-amount"
            className="block text-13 font-medium text-neutral-50"
          >
            Amount to stake
          </label>
          <div className="rounded-12 border border-neutral-20 bg-white-100 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-27 font-semibold text-neutral-40">0</span>
              <div className="flex items-center gap-1">
                <SNTIcon />
                <span className="text-19 font-semibold text-neutral-80">
                  SNT
                </span>
              </div>
            </div>
            <div className="-mx-4 my-3 h-px w-[calc(100%+32px)] bg-neutral-10" />
            <div className="flex items-center justify-between text-13 font-500 text-neutral-50">
              <Skeleton height={18} width={100} className="rounded-6" />
              <Skeleton height={18} width={100} className="rounded-6" />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="vault-select"
            className="block text-13 font-medium text-neutral-50"
          >
            Select vault
          </label>
          <div className="rounded-12 border border-neutral-20 bg-white-100 py-[9px] pl-4 pr-3">
            <div className="flex items-center gap-2">
              <UnlockedIcon className="text-neutral-100" />
              <Skeleton height={22} width="100%" className="flex-1 rounded-6" />
              <DropdownIcon className="text-neutral-40" />
            </div>
          </div>
        </div>
      </div>

      <Button disabled type="button" className="w-full justify-center">
        Stake SNT
      </Button>
    </div>
  )
}

type ConnectionStatus =
  | 'uninstalled'
  | 'disconnected'
  | 'connected'
  | 'signInRequired'

const createStakeFormSchema = () => {
  return z.object({
    amount: z.string(),
    vault: z.string(),
  })
}

type FormValues = z.infer<ReturnType<typeof createStakeFormSchema>>

const StakeForm = () => {
  const { mutate: createVault } = useCreateVault()
  const { address, isConnected, isConnecting } = useAccount()
  const { mutateAsync: approveToken } = useApproveToken()
  const { mutateAsync: stakeVault } = useVaultTokenStake()
  const { isSignedIn, isLoading: isLoadingSIWE, signIn } = useSIWE()
  const { data: vaults, refetch: refetchStakingVaults } = useStakingVaults()
  // State machine for vault operations
  const { send: sendVaultEvent } = useVaultStateContext()
  const { data: exchangeRate } = useExchangeRate()
  const { isInstalled: isStatusWalletInstalled } = useStatusWallet()
  const { data: emergencyModeEnabled } = useEmergencyModeEnabled()
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false)
  const [lockModalVaultAddress, setLockModalVaultAddress] =
    useState<Address | null>(null)

  const status: ConnectionStatus = useMemo(() => {
    if (isConnected && !isSignedIn) return 'signInRequired'
    if (isConnected) return 'connected'
    if (!isStatusWalletInstalled) return 'uninstalled'
    return 'disconnected'
  }, [isConnected, isSignedIn, isStatusWalletInstalled])

  const {
    data: balance,
    isLoading,
    refetch: refetchBalance,
  } = useBalance({
    scopeKey: 'balance',
    address,
    token: STT_TOKEN.address,
    query: {
      enabled: isConnected,
    },
  })

  const form = useForm<FormValues>({
    resolver: zodResolver(createStakeFormSchema()),
    mode: 'onChange',
    defaultValues: {
      amount: '',
      vault: '',
    },
  })
  const config = useConfig()

  // Watch the amount field for changes
  const amountValue = useWatch({
    control: form.control,
    name: 'amount',
    defaultValue: '',
  })

  const amountInUSDValue = useMemo(() => {
    const amountInputNumber = parseFloat(amountValue || '0')
    if (exchangeRate && !isNaN(amountInputNumber)) {
      return amountInputNumber * exchangeRate.price
    }
    return 0
  }, [amountValue, exchangeRate])

  const executeStake = async (vaultAddress: Address, amountWei: bigint) => {
    await stakeVault({
      amountWei,
      lockPeriod: STAKE_PAGE_CONSTANTS.DEFAULT_STAKE_LOCK_PERIOD,
      vaultAddress,
    })

    // Only reset and refetch after successful staking
    form.reset()
    await Promise.all([refetchStakingVaults(), refetchBalance()])

    setLockModalVaultAddress(vaultAddress)
  }

  const handleSubmit = async (data: FormValues) => {
    if (!data.amount || !data.vault || !address) return

    const vaultAddress = data.vault as Address
    const amountWei = parseUnits(data.amount, STT_TOKEN.decimals)

    try {
      // Check current allowance
      const currentAllowance = (await readContract(config, {
        address: STT_TOKEN.address,
        abi: STT_TOKEN.abi,
        functionName: 'allowance',
        args: [address, vaultAddress],
      })) as bigint

      // If not enough allowance, approve first, then stake in onSuccess
      if (amountWei > currentAllowance) {
        await approveToken(
          {
            amount: data.amount,
            spenderAddress: vaultAddress,
          },
          {
            onSuccess: () => {
              executeStake(vaultAddress, amountWei)
            },
          }
        )
        return
      }

      // Allowance is sufficient, stake directly
      await executeStake(vaultAddress, amountWei)
    } catch (error) {
      sendVaultEvent({ type: 'REJECT' })
      console.error('Staking failed:', error)
    }
  }

  const showLoadingSkeleton =
    isConnecting || (isConnected && (isLoading || isLoadingSIWE))

  if (showLoadingSkeleton) {
    return <StakeFormSkeleton />
  }

  return (
    <>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex flex-col gap-4 rounded-16 border border-neutral-10 bg-white-100 p-4 shadow-2 md:rounded-32 md:p-8"
      >
        <div className="flex flex-1 flex-col gap-4">
          <StakeAmountInput
            balance={balance?.value}
            amountInUSD={amountInUSDValue}
            onMaxClick={() => {
              const maxValue = balance?.toString() ?? '0'
              const formatted = (Number(maxValue) / 1e18)
                .toFixed(18)
                .replace(/\.?0+$/, '')
              form.setValue('amount', formatted)
            }}
            register={form.register}
            isConnected={status === 'connected'}
            isLoading={isLoading}
            isDisabled={vaults?.length === 0}
          />

          <div
            className={match(status)
              .with('connected', () => 'space-y-2')
              .with('signInRequired', () => 'space-y-2 opacity-[40%]')
              .otherwise(() => 'space-y-2 opacity-[40%]')}
          >
            <label
              htmlFor="vault-select"
              className="block text-13 font-medium text-neutral-50"
            >
              Select vault
            </label>
            {match(status)
              .with('connected', () => (
                <VaultSelect
                  vaults={vaults ?? []}
                  value={form.watch('vault')}
                  onChange={value => form.setValue('vault', value)}
                  disabled={vaults?.length === 0}
                />
              ))
              .otherwise(() => (
                <div className="rounded-12 border border-neutral-20 bg-white-100 py-[9px] pl-4 pr-3">
                  <div className="flex items-center justify-between">
                    <span className="text-15">Add new vault</span>
                    <DropdownIcon className="text-neutral-40" />
                  </div>
                </div>
              ))}
          </div>
        </div>

        {match(status)
          .with('uninstalled', () => (
            <PromoModal
              open={isPromoModalOpen}
              onClose={() => setIsPromoModalOpen(false)}
            >
              <Button
                className="w-full justify-center"
                onClick={() => setIsPromoModalOpen(true)}
              >
                Connect Wallet
              </Button>
            </PromoModal>
          ))
          .with('disconnected', () => (
            <ConnectKitButton.Custom>
              {({ show }) => (
                <Button
                  className="w-full justify-center"
                  onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                    e.preventDefault()
                    show?.()
                  }}
                >
                  Connect Wallet
                </Button>
              )}
            </ConnectKitButton.Custom>
          ))
          .with('signInRequired', () => (
            <Button
              className="w-full justify-center"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault()
                signIn?.()
              }}
            >
              Sign in to continue
            </Button>
          ))
          .with('connected', () => {
            return form.watch('vault') && form.watch('amount') ? (
              <Button
                className="w-full justify-center"
                type="submit"
                disabled={Boolean(emergencyModeEnabled)}
              >
                Stake SNT
              </Button>
            ) : (
              <Button
                className="w-full justify-center"
                onClick={() => createVault()}
                disabled={Boolean(emergencyModeEnabled)}
              >
                Create new vault
              </Button>
            )
          })
          .exhaustive()}
      </form>

      {lockModalVaultAddress && (
        <LockVaultModal
          open={!!lockModalVaultAddress}
          onOpenChange={open => {
            if (!open) setLockModalVaultAddress(null)
          }}
          onClose={() => setLockModalVaultAddress(null)}
          vaultAddress={lockModalVaultAddress}
          title="Do you want to lock the vault?"
          description="Lock this vault to receive more Karma"
          actions={[...LOCK_VAULT_ACTIONS]}
        />
      )}
    </>
  )
}

export { StakeForm, StakeFormSkeleton }
