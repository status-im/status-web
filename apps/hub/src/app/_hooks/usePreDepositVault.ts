import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { parseUnits } from 'viem'
import { BaseError, useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'

import type { Vault } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for token approval
 */
export interface PreDepositVaultParams {
  /** Vault to predeposit into */
  vault: Vault
  /** Amount of tokens to predeposit (in token units, not wei) */
  amount: string
}

/**
 * Return type for usePreDepositVault hook
 */
export type UsePreDepositVaultReturn = UseMutationResult<
  void,
  Error,
  PreDepositVaultParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'pre-deposit-vault' as const

const TRANSACTION_CONFIG = {
  CONFIRMATION_BLOCKS: 1,
} as const

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to approve PreDeposit tokens for a spender (pre-deposit vault).
 *
 * **Approval Process:**
 * 1. Validates wallet connection and parameters
 * 2. Converts amount to wei
 * 3. Calls ERC20 approve function
 * 4. Waits for transaction confirmation
 * 5. Updates state machine with approval status
 *
 * @returns Mutation result with approval function and status
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When amount is invalid or zero
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function PreDepositVaultButton() {
 *   const { mutate: preDeposit, isPending } = usePreDepositVault()
 *
 *   const handlePreDeposit = () => {
 *     preDeposit({
 *       vault,
 *       amount: '100',
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleApprove} disabled={isPending}>
 *       {isPending ? 'Approving...' : 'Approve ${SNT_TOKEN.symbol}'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With callbacks
 * ```tsx
 *  function preDepositIntoVault() {
 *    preDeposit({ vault, amount })
 *      {
 *        onSuccess: (txHash) => {
 *        console.log('Approved! Transaction:', txHash)
 *      },
 *        onError: (error) => {
 *        console.error('Approval failed:', error)
 *      },
 *    }
 *  )
 * ```
 */
export function usePreDepositVault(): UsePreDepositVaultReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({
      vault,
      amount,
    }: PreDepositVaultParams): Promise<void> => {
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      const amountWei = parseUnits(amount, vault.token.decimals)

      sendPreDepositEvent({
        type: 'START_APPROVE_TOKEN',
        amount,
      })

      try {
        const hash = await writeContractAsync({
          address: vault.address,
          abi: vault.abi,
          functionName: 'deposit',
          args: [amountWei, address],
        })

        sendPreDepositEvent({ type: 'EXECUTE' })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        if (status === 'reverted') {
          throw new Error('Transaction was reverted')
        }

        sendPreDepositEvent({ type: 'COMPLETE', amount })
        toast.positive(`Successfully deposited into ${vault.name}`)
      } catch (error) {
        console.error(`Failed to deposit into ${vault.name}: `, error)
        sendPreDepositEvent({ type: 'REJECT' })
        const message =
          error instanceof BaseError ? error.shortMessage : 'Transaction failed'
        toast.negative(message)
        throw error
      }
    },
  })
}
