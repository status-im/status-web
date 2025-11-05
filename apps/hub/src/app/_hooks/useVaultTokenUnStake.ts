import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address, formatUnits } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { vaultAbi } from '~constants/contracts'
import {
  CONFIRMATION_BLOCKS,
  MIN_STAKE_AMOUNT,
  SNT_TOKEN,
} from '~constants/index'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useVaultStateContext } from '~hooks/useVaultStateContext'

import { useMultiplierPointsBalance } from './useMultiplierPoints'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for unstaking from a vault
 */
export interface UnStakeParams {
  /** Amount to stake in wei */
  amountWei: bigint
  /** Vault address */
  vaultAddress: Address
}

/**
 * Return type for the useVaultStake hook
 */
export type UseVaultUnstakeReturn = UseMutationResult<
  void,
  Error,
  UnStakeParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'vault-unstake' as const

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to unstake tokens from a vault
 *
 * Unstakes tokens from the StakingManager contract.
 * Manages the state machine transitions for the unstaking process.
 *
 * @returns Mutation result with mutate function to trigger unstaking
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function UnStakeButton({ amount }: { amount: bigint }) {
 *   const { mutate: unstake, isPending } = useVaultUnStake()
 *
 *   return (
 *     <button
 *       onClick={() => unstake({ amountWei: amount })}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Unstaking...' : 'Unstake SNT'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function UnStakeManager() {
 *   const { mutate: unstake, isPending } = useVaultTokenUnStake()
 *
 *   const handleUnStake = (amount: bigint) => {
 *     unstake(
 *       { amountWei: amount },
 *       {
 *         onSuccess: (txHash) => {
 *           console.log('Unstaked successfully! Transaction:', txHash)
 *         },
 *         onError: (error) => {
 *           console.error('Failed to unstake:', error)
 *         },
 *       }
 *     )
 *   }
 *
 *   return <UnStakeForm onSubmit={handleUnStake} />
 * }
 * ```
 */
export function useVaultTokenUnStake(): UseVaultUnstakeReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const { refetch: refetchStakingVaults } = useStakingVaults()
  const { refetch: refetchMultiplierPoints } = useMultiplierPointsBalance()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      amountWei,
      vaultAddress,
    }: UnStakeParams): Promise<void> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate amount
      if (amountWei <= MIN_STAKE_AMOUNT) {
        throw new Error('Amount must be greater than 0')
      }

      // Send state machine event to start unstaking
      sendVaultEvent({
        type: 'START_UNSTAKING',
        amount: formatUnits(amountWei, SNT_TOKEN.decimals),
      })

      try {
        // Execute unstaking transaction
        const hash = await writeContractAsync({
          account: address,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'unstake',
          args: [amountWei],
        })

        // Transaction submitted successfully, transition to processing
        sendVaultEvent({ type: 'SIGN' })

        // Wait for transaction confirmation
        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: CONFIRMATION_BLOCKS,
        })

        // Check if transaction was reverted
        if (status === 'reverted') {
          sendVaultEvent({ type: 'REJECT' })
          throw new Error('Transaction was reverted')
        }

        // Transaction successful, refetch data and reset vault
        await Promise.all([refetchStakingVaults(), refetchMultiplierPoints()])
        resetVault()
      } catch (error) {
        // Transaction failed or user rejected
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
