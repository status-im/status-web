import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address, parseUnits, zeroAddress } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { SNT_TOKEN } from '~constants/index'
import { useVaultStateContext } from '~hooks/useVaultStateContext'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for token approval
 */
export interface ApproveTokenParams {
  /** Amount of tokens to approve (in token units, not wei) */
  amount: string
  /** Address of the spender (vault) to approve tokens for */
  spenderAddress: Address
}

/**
 * Return type for useApproveToken hook
 */
export type UseApproveTokenReturn = UseMutationResult<
  void,
  Error,
  ApproveTokenParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'approve-token' as const

const TRANSACTION_CONFIG = {
  CONFIRMATION_BLOCKS: 1,
} as const

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to approve SNT tokens for a spender (typically a vault)
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
 * @throws {Error} When spender address is invalid
 * @throws {Error} When amount is invalid or zero
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function ApproveButton() {
 *   const { mutate: approveToken, isPending } = useApproveToken()
 *
 *   const handleApprove = () => {
 *     approveToken({
 *       amount: '100',
 *       spenderAddress: vaultAddress
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleApprove} disabled={isPending}>
 *       {isPending ? 'Approving...' : 'Approve SNT'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With callbacks
 * ```tsx
 * approveToken(
 *   { amount: '100', spenderAddress: vaultAddress },
 *   {
 *     onSuccess: (txHash) => {
 *       console.log('Approved! Transaction:', txHash)
 *     },
 *     onError: (error) => {
 *       console.error('Approval failed:', error)
 *     },
 *   }
 * )
 * ```
 */
export function useApproveToken(): UseApproveTokenReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent } = useVaultStateContext()
  const toast = useToast()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({
      amount,
      spenderAddress,
    }: ApproveTokenParams): Promise<void> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate spender address
      if (!spenderAddress || spenderAddress === zeroAddress) {
        throw new Error('Invalid spender address provided')
      }

      // Validate amount
      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      // Convert amount to wei
      const amountWei = parseUnits(amount, SNT_TOKEN.decimals)

      // Notify state machine of approval start
      sendVaultEvent({
        type: 'START_INCREASE_ALLOWANCE',
        amount,
      })

      try {
        // Execute approval transaction
        const hash = await writeContractAsync({
          address: SNT_TOKEN.address,
          abi: SNT_TOKEN.abi,
          functionName: 'approve',
          args: [spenderAddress, amountWei],
        })

        // Transaction submitted, notify state machine
        sendVaultEvent({ type: 'SIGN' })

        // Wait for confirmation
        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        // Check for revert
        if (status === 'reverted') {
          throw new Error('Transaction was reverted')
        }

        // Approval successful, notify state machine
        sendVaultEvent({ type: 'COMPLETE', amount })
        toast.positive('Token Allowance has been increased')
      } catch (error) {
        // Handle approval failure
        console.error('Failed to approve tokens:', error)
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
