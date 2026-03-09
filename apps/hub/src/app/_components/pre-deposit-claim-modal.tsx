'use client'

import { useEffect, useMemo, useState } from 'react'

import { Button } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { statusSepolia } from 'wagmi/chains'

import { type Vault } from '~constants/address'
import { useFulfillClaim } from '~hooks/useFulfillClaim'
import { useVaultBalanceReadiness } from '~hooks/useVaultBalanceReadiness'
import { formatTokenAmount } from '~utils/currency'

import { NetworkSwitchErrorDialog } from './network-switch-error-dialog'
import { VaultImage } from './vault-image'
import { BaseVaultModal } from './vaults/modals/base-vault-modal'

// ============================================================================
// Types
// ============================================================================

type PreDepositClaimModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vault: Vault
  onClaimSuccess?: () => void
}

type AllocationOption = 'provide_liquidity' | 'lend_mint' | 'withdraw'

const ALLOCATION_OPTIONS: {
  id: AllocationOption
  labelKey: string
  descriptionKey: string
  enabled: boolean
}[] = [
  {
    id: 'provide_liquidity',
    labelKey: 'vault.provide_liquidity',
    descriptionKey: 'vault.provide_liquidity_description',
    enabled: false,
  },
  {
    id: 'lend_mint',
    labelKey: 'vault.lend_mint',
    descriptionKey: 'vault.lend_mint_description',
    enabled: false,
  },
  {
    id: 'withdraw',
    labelKey: 'vault.withdraw',
    descriptionKey: 'vault.withdraw_option_description',
    enabled: true,
  },
]

// ============================================================================
// Component
// ============================================================================

const PreDepositClaimModal = ({
  open,
  onOpenChange,
  vault,
  onClaimSuccess,
}: PreDepositClaimModalProps) => {
  const t = useTranslations()
  const { address } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending: isSwitchingChain } = useSwitchChain()
  const [hasSwitchError, setHasSwitchError] = useState(false)
  const [selectedOption, setSelectedOption] = useState<AllocationOption | null>(
    null
  )

  const {
    l2PendingAmount: pendingAmount,
    isL2PendingLoading: isPendingLoading,
    hasL2Pending: hasPending,
    refetchL2PendingWithdrawal,
  } = useVaultBalanceReadiness({ vault })
  const { mutate: fulfillClaim, isPending: isClaiming } = useFulfillClaim()

  const isWrongChain = useMemo(() => {
    if (!chainId) return false
    return statusSepolia.id !== chainId
  }, [chainId])

  useEffect(() => {
    if (!isWrongChain && hasSwitchError) {
      setHasSwitchError(false)
    }
  }, [isWrongChain, hasSwitchError])

  useEffect(() => {
    if (!open) {
      setSelectedOption(null)
    }
  }, [open])

  const handleContinue = () => {
    if (!address || !hasPending || isWrongChain || !selectedOption) return

    fulfillClaim(
      { vault },
      {
        onSuccess: () => {
          void refetchL2PendingWithdrawal()
          onClaimSuccess?.()
          onOpenChange(false)
        },
      }
    )
  }

  const formattedAmount = formatTokenAmount(
    pendingAmount ?? 0n,
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
      onClose={() => setSelectedOption(null)}
      title={t('vault.allocate_title')}
      description={t('vault.allocate_description')}
      blur={hasSwitchError}
    >
      <div className="space-y-4 px-4 pb-4">
        {/* Amount to allocate */}
        <div>
          <p className="text-13 font-500 text-neutral-50">
            {t('vault.amount_to_allocate')}
          </p>
          <div className="flex items-center justify-between rounded-16 border border-neutral-20 bg-white-100 px-4 py-3">
            <span className="text-27 font-600 text-neutral-100">
              {isPendingLoading ? '...' : formattedAmount}
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

        {/* Allocation options */}
        <div className="space-y-3">
          {ALLOCATION_OPTIONS.map(option => {
            const isSelected = selectedOption === option.id
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => option.enabled && setSelectedOption(option.id)}
                disabled={!option.enabled}
                className={`flex w-full items-start gap-3 rounded-16 border p-4 text-left transition-colors ${
                  !option.enabled
                    ? 'cursor-not-allowed border-neutral-10 bg-neutral-5'
                    : isSelected
                      ? 'border-neutral-100 bg-neutral-5'
                      : 'border-neutral-20 bg-white-100 hover:border-neutral-30'
                }`}
              >
                <div
                  className={`mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full border-2 ${
                    isSelected ? 'border-neutral-100' : 'border-neutral-30'
                  }`}
                >
                  {isSelected && (
                    <div className="size-2.5 rounded-full bg-neutral-100" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-15 font-600 text-neutral-100">
                    {t(option.labelKey as 'vault.withdraw')}
                  </p>
                  <p className="text-13 text-neutral-50">
                    {t(
                      option.descriptionKey as 'vault.withdraw_option_description'
                    )}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Actions */}
        <div className="flex w-full gap-3 pt-4">
          {isWrongChain ? (
            <Button
              type="button"
              className="w-full justify-center"
              onClick={() =>
                switchChain(
                  { chainId: statusSepolia.id },
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
                : t('vault.switch_network_to_claim')}
            </Button>
          ) : (
            <Button
              type="button"
              className="w-full justify-center"
              onClick={handleContinue}
              disabled={
                isClaiming || !hasPending || isPendingLoading || !selectedOption
              }
            >
              {t('vault.continue')}
            </Button>
          )}
        </div>
      </div>
      <NetworkSwitchErrorDialog
        open={hasSwitchError}
        onClose={() => setHasSwitchError(false)}
        onRetry={() => window.location.reload()}
        description={t('network_switch_error.description_status_network')}
        showNetworkDetails={false}
      />
    </BaseVaultModal>
  )
}

export { PreDepositClaimModal }
