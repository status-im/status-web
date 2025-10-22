import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { formatUnits, zeroAddress } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import {
  CONFIRMATION_BLOCKS,
  DEFAULT_MP_VALUE,
  SNT_TOKEN,
  STAKING_MANAGER,
} from '~constants/index'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'

import { useVaultStateContext } from './useVaultStateContext'

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for the useCompoundMultiplierPoints mutation hook
 */
export type UseCompoundMultiplierPointsReturn = UseMutationResult<
  void,
  Error,
  void,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'compound-multiplier-points' as const

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to compound multiplier points (MP) for the connected account
 *
 * **Compounding Process:**
 * Calls StakingManager.updateAccount() which:
 * - Updates global state (reward index, MP accrual)
 * - Calculates new MP accrued since last update
 * - Updates the account's reward index
 * - Compounds rewards based on current MP balance
 * - Emits AccountUpdated event
 *
 * @returns Mutation result with mutate function to trigger compounding
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When account address is invalid
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function CompoundButton() {
 *   const { mutate: compound, isPending } = useCompoundMultiplierPoints()
 *
 *   return (
 *     <button
 *       onClick={() => compound()}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Compounding...' : 'Compound Points'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function CompoundManager() {
 *   const { mutate: compound, isPending } = useCompoundMultiplierPoints()
 *
 *   const handleCompound = () => {
 *     compound(undefined, {
 *       onSuccess: (txHash) => {
 *         toast.success(`Compounded! Tx: ${txHash}`)
 *       },
 *       onError: (error) => {
 *         toast.error(`Failed to compound: ${error.message}`)
 *       },
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleCompound} disabled={isPending}>
 *       {isPending ? 'Compounding...' : 'Compound MP'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useCompoundMultiplierPoints(): UseCompoundMultiplierPointsReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { data: mpBalance, refetch: refetchMultiplierPoints } =
    useMultiplierPointsBalance()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async (): Promise<void> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate account address
      if (address === zeroAddress) {
        throw new Error('Invalid account address provided')
      }

      // Get the current MP balance to show in the dialog
      const formattedAmount = formatUnits(
        mpBalance?.totalUncompounded || DEFAULT_MP_VALUE,
        SNT_TOKEN.decimals
      )

      sendVaultEvent({
        type: 'START_COMPOUND',
        amount: formattedAmount,
      })

      // Execute compound transaction via updateAccount
      const hash = await writeContractAsync({
        account: address,
        address: STAKING_MANAGER.address,
        abi: STAKING_MANAGER.abi,
        functionName: 'updateAccount',
        args: [address],
      })

      // Signal user to sign transaction
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
    },
    onSuccess: () => {
      resetVault()
      // Refetch account vaults to update UI with new compounded values
      refetchMultiplierPoints()
    },
    onError: () => {
      sendVaultEvent({ type: 'REJECT' })
    },
  })
}
