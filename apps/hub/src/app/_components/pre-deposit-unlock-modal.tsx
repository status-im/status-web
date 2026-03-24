'use client'

import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from '@status-im/components'
import { AlertIcon } from '@status-im/icons/12'
import { Button } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { isAddress } from 'viem'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { z } from 'zod'

import { isGUSDVault, type Vault } from '~constants/address'
import { usePreDepositUnlock } from '~hooks/usePreDepositUnlock'
import { useUnlockTxHash } from '~hooks/useUnlockTxHash'
import { useVaultBalanceReadiness } from '~hooks/useVaultBalanceReadiness'
import { formatTokenAmount } from '~utils/currency'

import { NetworkSwitchErrorDialog } from './network-switch-error-dialog'
import { VaultImage } from './vault-image'
import { BaseVaultModal } from './vaults/modals/base-vault-modal'

import type { Address } from 'viem'

// ============================================================================
// Types
// ============================================================================

type PreDepositUnlockModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vault: Vault
  onUnlockSuccess?: () => void
}

// ============================================================================
// Form Schema
// ============================================================================

type FormValues = {
  receiver: string
}

const createUnlockFormSchema = (t: ReturnType<typeof useTranslations>) =>
  z.object({
    receiver: z.string().refine((val): val is string => isAddress(val), {
      message: t('vault.invalid_address'),
    }),
  })

// ============================================================================
// Component
// ============================================================================

const PreDepositUnlockModal = ({
  open,
  onOpenChange,
  vault,
  onUnlockSuccess,
}: PreDepositUnlockModalProps) => {
  const t = useTranslations()
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [hasSwitchError, setHasSwitchError] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const isGUSD = isGUSDVault(vault)

  const {
    l1Balance: depositedBalance,
    isL1BalanceLoading: isBalanceLoading,
    hasL1Balance: hasBalance,
    refetchL2PendingWithdrawal,
  } = useVaultBalanceReadiness({ vault })
  const { mutate: unlock, isPending: isUnlocking } = usePreDepositUnlock()
  const { setTxHash: saveUnlockTxHash, clearTxHash: clearUnlockTxHash } =
    useUnlockTxHash(vault.id)

  const form = useForm<FormValues>({
    resolver: zodResolver(createUnlockFormSchema(t)),
    mode: 'onChange',
    defaultValues: { receiver: '' },
  })

  // Pre-fill receiver with connected wallet address
  useEffect(() => {
    if (address && open) {
      form.setValue('receiver', address, { shouldValidate: true })
    }
  }, [address, open, form])

  // Reset confirmation when modal opens/closes
  useEffect(() => {
    if (!open) {
      setConfirmed(false)
    }
  }, [open])

  const isWrongChain = useMemo(() => {
    if (!vault || !chainId) return false
    return vault.chainId !== chainId
  }, [vault, chainId])

  useEffect(() => {
    if (!isWrongChain && hasSwitchError) {
      setHasSwitchError(false)
    }
  }, [isWrongChain, hasSwitchError])

  const handleSubmit = (data: FormValues) => {
    if (!address || !hasBalance || isWrongChain || isGUSD) return

    onOpenChange(false)

    unlock(
      {
        vault,
        amountWei: depositedBalance ?? 0n,
        receiver: data.receiver as Address,
        onTxHash: saveUnlockTxHash,
        onClearTxHash: clearUnlockTxHash,
      },
      {
        onSuccess: () => {
          if (vault.l2ClaimVaultAddress) {
            void refetchL2PendingWithdrawal()
          }
          onUnlockSuccess?.()
        },
      }
    )
  }

  const formattedBalance = formatTokenAmount(
    depositedBalance ?? 0n,
    vault.token.symbol,
    {
      tokenDecimals: vault.token.decimals,
      includeSymbol: true,
      roundDown: true,
    }
  )

  return (
    <BaseVaultModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={() => {
        form.reset()
        setConfirmed(false)
      }}
      title={t('vault.unlock_title')}
      description={t('vault.unlock_description')}
      blur={hasSwitchError}
    >
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <div className="space-y-4 px-4 pb-4">
          {/* Vault to unlock */}
          <div>
            <p className="text-13 font-500 text-neutral-50">
              {t('vault.vault_to_unlock')}
            </p>
            <div className="flex items-center gap-3 rounded-16 border border-neutral-20 bg-white-100 px-4 py-3">
              <VaultImage
                vault={vault.icon}
                network={vault.network}
                size="20"
              />
              <span className="text-15 font-400 text-neutral-100">
                {vault.token.symbol}, {vault.token.name}
              </span>
            </div>
          </div>

          {/* Amount to be unlocked (read-only) */}
          <div>
            <p className="text-13 font-500 text-neutral-50">
              {t('vault.amount_to_unlock')}
            </p>
            <div className="flex items-center justify-between rounded-16 border border-neutral-20 bg-white-100 px-4 py-3">
              <span className="text-27 font-600 text-neutral-100">
                {isBalanceLoading ? '...' : formattedBalance}
              </span>
              <div className="flex items-center gap-2">
                <VaultImage
                  vault={vault.icon}
                  network={vault.network}
                  size="20"
                />
                <span className="text-15 font-600 text-neutral-100">
                  {vault.token.symbol}
                </span>
              </div>
            </div>
          </div>

          {/* Receiver address input */}
          <div className="space-y-2">
            <label
              htmlFor="receiver-address"
              className="block text-13 font-500 text-neutral-50"
            >
              {t('vault.receiver_address')}
            </label>
            <input
              id="receiver-address"
              {...form.register('receiver')}
              disabled={isUnlocking || isGUSD}
              placeholder={t('vault.receiver_placeholder')}
              className={`w-full rounded-16 border bg-white-100 px-4 py-3 text-15 font-400 text-neutral-100 outline-none placeholder:text-neutral-40 focus:border-neutral-40 ${
                form.formState.errors.receiver
                  ? 'border-danger-50'
                  : 'border-neutral-20'
              }`}
            />
            {form.formState.errors.receiver && (
              <p className="flex items-center gap-1 text-13 text-danger-50">
                <AlertIcon className="shrink-0" />
                {form.formState.errors.receiver.message}
              </p>
            )}
          </div>

          {/* Confirmation checkbox */}
          <label className="flex cursor-pointer items-start gap-3">
            <div className="flex shrink-0 items-center">
              <Checkbox
                checked={confirmed}
                onCheckedChange={checked => setConfirmed(checked === true)}
                disabled={isGUSD}
              />
            </div>
            <span className="text-13 text-neutral-50">
              {t('vault.unlock_confirmation')}
            </span>
          </label>

          {/* Actions */}
          <div className="flex w-full gap-3 pt-4">
            {isWrongChain ? (
              <Button
                type="button"
                className="w-full justify-center"
                onClick={() =>
                  switchChain(
                    { chainId: vault.chainId },
                    {
                      onError: () => {
                        setHasSwitchError(true)
                      },
                    }
                  )
                }
                disabled={isSwitchingChain}
              >
                {isSwitchingChain
                  ? t('vault.switching')
                  : t('vault.switch_network_to_unlock')}
              </Button>
            ) : isGUSD ? (
              <Button type="button" className="w-full justify-center" disabled>
                {t('vault.coming_soon')}
              </Button>
            ) : (
              <Button
                type="submit"
                className="w-full justify-center"
                disabled={
                  isUnlocking ||
                  !hasBalance ||
                  !form.formState.isValid ||
                  !confirmed ||
                  isBalanceLoading
                }
              >
                {t('vault.unlock_vault')}
              </Button>
            )}
          </div>
        </div>
      </form>
      <NetworkSwitchErrorDialog
        open={hasSwitchError}
        onClose={() => setHasSwitchError(false)}
        onRetry={() => window.location.reload()}
        description={t('network_switch_error.description_ethereum_mainnet')}
        showNetworkDetails={false}
      />
    </BaseVaultModal>
  )
}

export { PreDepositUnlockModal }
