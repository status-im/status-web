import { useToast } from '@status-im/components'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { BaseError } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { statusSepolia } from 'wagmi/chains'

import { L2ClaimVaultAbi } from '~constants/contracts/L2ClaimVaultAbi'
import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'
import { isUserRejection } from '~utils/wallet'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

export interface FulfillClaimParams {
  vault: Vault
}

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'fulfill-claim' as const

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to call `fulfillClaim([])` on the L2 ClaimVault.
 *
 * Called with an empty actions array for simple withdrawal.
 * Later extensible with actions for pool deposits etc.
 */
export function useFulfillClaim() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()
  const t = useTranslations()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({ vault }: FulfillClaimParams): Promise<void> => {
      if (!address) {
        throw new Error(t('errors.wallet_not_connected'))
      }

      if (!vault.l2ClaimVaultAddress) {
        throw new Error('L2 ClaimVault address not configured')
      }

      sendPreDepositEvent({ type: 'START_CLAIM' })

      try {
        const hash = await writeContractAsync({
          address: vault.l2ClaimVaultAddress,
          abi: L2ClaimVaultAbi,
          functionName: 'fulfillClaim',
          args: [[]],
          chainId: statusSepolia.id,
        })

        sendPreDepositEvent({ type: 'EXECUTE' })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          chainId: statusSepolia.id,
          confirmations: 1,
          timeout: 90_000,
        })

        if (status === 'reverted') {
          throw new Error(t('errors.transaction_reverted'))
        }

        sendPreDepositEvent({ type: 'COMPLETE' })
        toast.positive(t('vault.claim_successful', { vault: vault.name }))
      } catch (error) {
        const isRejected = isUserRejection(error)
        sendPreDepositEvent({ type: isRejected ? 'REJECT' : 'FAIL' })
        if (!isRejected) {
          const message =
            error instanceof BaseError
              ? error.shortMessage
              : t('errors.transaction_failed')
          toast.negative(message)
        }
        throw error
      }
    },
  })
}
