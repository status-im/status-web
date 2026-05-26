'use client'

import { useEffect, useMemo, useState } from 'react'

import { InfoIcon } from '@status-im/icons/16'
import { Button } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'
import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { linea } from 'wagmi/chains'

import { type Vault } from '~constants/address'
import { useFulfillClaim } from '~hooks/useFulfillClaim'
import { useUnlockTxHash } from '~hooks/useUnlockTxHash'
import { useVaultBalanceReadiness } from '~hooks/useVaultBalanceReadiness'
import { formatTokenAmount } from '~utils/currency'

import { NetworkSwitchErrorDialog } from './network-switch-error-dialog'
import { VaultImage } from './vault-image'
import { BaseVaultModal } from './vaults/modals/base-vault-modal'

type PreDepositClaimModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  vault: Vault
  onClaimSuccess?: () => void
}

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

  const {
    l2PendingAmount: pendingAmount,
    isL2PendingLoading: isPendingLoading,
    hasL2Pending: hasPending,
    refetchL2PendingWithdrawal,
  } = useVaultBalanceReadiness({ vault })
  const { mutate: fulfillClaim, isPending: isClaiming } = useFulfillClaim()
  const { clearTxHash: clearUnlockTxHash } = useUnlockTxHash(vault.id)

  const isWrongChain = useMemo(() => {
    if (!chainId) return false
    return linea.id !== chainId
  }, [chainId])

  useEffect(() => {
    if (!isWrongChain && hasSwitchError) {
      setHasSwitchError(false)
    }
  }, [isWrongChain, hasSwitchError])

  const handleContinue = () => {
    if (!address || !hasPending || isWrongChain) return

    onOpenChange(false)

    fulfillClaim(
      { vault },
      {
        onSuccess: () => {
          clearUnlockTxHash()
          void refetchL2PendingWithdrawal()
          onClaimSuccess?.()
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
      onClose={() => undefined}
      title={t('vault.claim_title')}
      description={t('vault.claim_description')}
      blur={hasSwitchError}
    >
      <div className="space-y-4 px-4 pb-4">
        <div className="space-y-2">
          <p className="text-13 font-500 text-neutral-50">
            {t('vault.amount_to_claim')}
          </p>
          <div className="flex items-center justify-between rounded-16 border border-neutral-20 bg-white-100 px-4 py-3">
            <span className="text-27 font-600 text-neutral-100">
              {isPendingLoading ? '...' : formattedAmount}
            </span>
            <div className="flex items-center gap-2">
              <VaultImage vault={vault.icon} network={linea.name} size="32" />
              <span className="text-15 font-600 text-neutral-100">
                {vault.token.symbol}
              </span>
            </div>
          </div>
        </div>

        <div
          data-customisation="blue"
          className="flex items-center gap-2 rounded-12 border border-customisation-50/10 bg-customisation-50/5 px-4 py-3"
        >
          <InfoIcon className="shrink-0 text-customisation-50" />
          <p className="text-13 font-400 text-neutral-100">
            {t('vault.smol_refuel_question')}{' '}
            <a
              href="https://smolrefuel.com/?outboundChain=59144"
              target="_blank"
              rel="noopener noreferrer"
              className="font-500 text-customisation-50 underline"
            >
              {t('vault.smol_refuel_cta')}
            </a>
          </p>
        </div>

        <div className="flex w-full gap-3 pt-4">
          {isWrongChain ? (
            <Button
              type="button"
              className="w-full justify-center"
              onClick={() =>
                switchChain(
                  { chainId: linea.id },
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
              disabled={isClaiming || !hasPending || isPendingLoading}
            >
              {t('vault.claim')}
            </Button>
          )}
        </div>
      </div>
      <NetworkSwitchErrorDialog
        open={hasSwitchError}
        onClose={() => setHasSwitchError(false)}
        onRetry={() => window.location.reload()}
        description={t('network_switch_error.description_linea')}
        showNetworkDetails={false}
      />
    </BaseVaultModal>
  )
}

export { PreDepositClaimModal }
