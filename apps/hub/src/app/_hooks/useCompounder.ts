import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { STAKING_MANAGER } from '../../config'
import { statusNetworkTestnet } from '../../config/chain'
import { stakingManagerAbi } from '../contracts'
import { useAccountVaults } from './useAccountVaults'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for compounding a vault
 */
export interface CompoundVaultParams {
  /** The vault address to compound */
  vaultAddress: Address
}

/**
 * Return type for the useCompounder hook
 */
export type UseCompounderReturn = UseMutationResult<
  Address,
  Error,
  CompoundVaultParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'compound' as const
const CONFIRMATION_BLOCKS = 1

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to compound multiplier points (MP) for a vault
 *
 * **Compounding Process:**
 * Calls StakingManager.compound() which:
 * - Updates global state (reward index, MP accrual)
 * - Calculates new MP accrued since last update
 * - Updates the vault's reward index
 * - Compounds rewards based on current MP balance
 * - Emits VaultUpdated event
 *
 * @returns Mutation result with mutate function to trigger compound
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When vault address is invalid
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function CompoundButton({ vaultAddress }: { vaultAddress: Address }) {
 *   const { mutate: compound, isPending } = useCompounder()
 *
 *   return (
 *     <button
 *       onClick={() => compound({ vaultAddress })}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Compounding...' : 'Compound'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function CompoundManager({ vaultAddress }: { vaultAddress: Address }) {
 *   const { mutate: compound, isPending, isSuccess, error } = useCompounder()
 *
 *   const handleCompound = () => {
 *     compound(
 *       { vaultAddress },
 *       {
 *         onSuccess: (txHash) => {
 *           console.log('Transaction hash:', txHash)
 *         },
 *         onError: (error) => {
 *           console.error('Compound failed:', error)
 *         },
 *       }
 *     )
 *   }
 *
 *   return (
 *     <button onClick={handleCompound} disabled={isPending}>
 *       Compound MP
 *     </button>
 *   )
 * }
 * ```
 */
export function useCompounder(): UseCompounderReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { refetch: refetchAccountVaults } = useAccountVaults()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      vaultAddress,
    }: CompoundVaultParams): Promise<Address> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate vault address
      if (!vaultAddress || vaultAddress === '0x0') {
        throw new Error('Invalid vault address provided')
      }

      // Execute compound transaction
      const hash = await writeContractAsync({
        chain: statusNetworkTestnet,
        account: address,
        address: STAKING_MANAGER.address,
        abi: stakingManagerAbi,
        functionName: 'compound',
        args: [vaultAddress],
      })

      // Wait for transaction confirmation
      const { status } = await waitForTransactionReceipt(config, {
        hash,
        confirmations: CONFIRMATION_BLOCKS,
      })

      // Check if transaction was reverted
      if (status === 'reverted') {
        throw new Error('Transaction was reverted')
      }

      // Refetch account vaults to update UI
      refetchAccountVaults()

      return hash
    },
  })
}
