import { useToast } from '@status-im/components'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { BaseError } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { PreDepositVaultAbi } from '~constants/contracts/PreDepositVaultAbi'
import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'
import { isUserRejection } from '~utils/wallet'

import type { Vault } from '~constants/index'
import type { Address } from 'viem'

// ============================================================================
// Types
// ============================================================================

export interface PreDepositUnlockParams {
  vault: Vault
  amountWei: bigint
  receiver: Address
  onTxHash?: (hash: string) => void
  onClearTxHash?: () => void
}

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'pre-deposit-unlock' as const

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to withdraw (unlock) the full balance from a pre-deposit vault.
 *
 * Calls `withdraw(assets, receiver, owner)` on the vault contract.
 * No approval step needed — single transaction.
 */
export function usePreDepositUnlock() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()
  const t = useTranslations()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({
      vault,
      amountWei,
      receiver,
      onTxHash,
      onClearTxHash,
    }: PreDepositUnlockParams): Promise<void> => {
      if (!address) {
        throw new Error(t('errors.wallet_not_connected'))
      }

      if (amountWei <= 0n) {
        throw new Error(t('vault.no_balance_to_unlock'))
      }

      sendPreDepositEvent({ type: 'START_UNLOCK' })

      try {
        const hash = await writeContractAsync({
          address: vault.address,
          abi: PreDepositVaultAbi,
          functionName: 'withdraw',
          args: [amountWei, receiver, address],
          chainId: vault.chainId,
        })

        sendPreDepositEvent({ type: 'EXECUTE' })
        onTxHash?.(hash)

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          chainId: vault.chainId,
          confirmations: 1,
          timeout: 90_000,
        })

        if (status === 'reverted') {
          onClearTxHash?.()
          throw new Error(t('errors.transaction_reverted'))
        }

        sendPreDepositEvent({ type: 'COMPLETE' })
        toast.positive(t('vault.unlock_successful', { vault: vault.name }))
      } catch (error) {
        onClearTxHash?.()
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
