import { useMutation } from '@tanstack/react-query'
import { zeroAddress } from 'viem'
import { parseUnits } from 'viem/utils'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { SNT_TOKEN } from '../../config'
import { tokenAbi } from '../contracts'
import { useVaultStateContext } from './vault-state-context'

import type { UseMutationResult } from '@tanstack/react-query'
import type { Address } from 'viem/accounts'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for token approval mutation
 */
export interface ApprovalParams {
  /** Amount of tokens to approve (in token units, not wei) */
  amount: string
  /** Address of the vault to approve tokens for */
  vaultAddress: Address
}

/**
 * Return type for useTokenApproval hook
 */
export type UseTokenApprovalReturn = UseMutationResult<
  Address,
  Error,
  ApprovalParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'token-approval'

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook for approving SNT tokens for a vault
 *
 * This hook handles the token approval flow:
 * 1. Checks current allowance
 * 2. If allowance is insufficient, requests approval from user
 * 3. Waits for transaction confirmation
 * 4. Updates state machine with approval status
 *
 * @example
 * ```tsx
 * const { mutate: approveTokens, isPending } = useTokenApproval()
 *
 * const handleApprove = () => {
 *   approveTokens({
 *     amount: '100',
 *     vaultAddress: '0x...'
 *   })
 * }
 * ```
 *
 * @returns Mutation result with approval function and status
 */
export const useTokenApproval = (): UseTokenApprovalReturn => {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent } = useVaultStateContext()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      amount,
      vaultAddress,
    }: ApprovalParams): Promise<Address> => {
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      if (!vaultAddress || vaultAddress === zeroAddress) {
        throw new Error('Invalid vault address provided')
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      const amountWei = parseUnits(amount, SNT_TOKEN.decimals)

      sendVaultEvent({
        type: 'START_INCREASE_ALLOWANCE',
        amount: amount,
      })

      try {
        const hash = await writeContractAsync({
          address: SNT_TOKEN.address,
          abi: tokenAbi,
          functionName: 'approve',
          args: [vaultAddress, amountWei],
        })

        sendVaultEvent({ type: 'SIGN' })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: 1,
        })

        if (status === 'reverted') {
          throw new Error('Transaction was reverted')
        }

        sendVaultEvent({ type: 'COMPLETE', amount })

        return hash
      } catch (error) {
        console.error('Failed to approve tokens:', error)
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
