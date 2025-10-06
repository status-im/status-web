import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useAccount, useWriteContract } from 'wagmi'

import { STAKING_MANAGER } from '../../config'
import { stakingManagerAbi } from '../contracts'

import type { Address } from 'viem'

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

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'compound' as const

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to compound multiplier points (MP) for a specific vault
 *
 * **Compounding Process:**
 * Calls StakingManager.updateVault() which:
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
export function useCompounder(): UseMutationResult<
  Address,
  Error,
  CompoundVaultParams,
  unknown
> {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, 'vault', address],
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
        address: STAKING_MANAGER.address,
        abi: stakingManagerAbi,
        functionName: 'updateVault',
        args: [vaultAddress],
      })

      return hash
    },
  })
}

// ============================================================================
// Compound All Mutation Hook
// ============================================================================

/**
 * Mutation hook to compound multiplier points (MP) for all user vaults
 *
 * Calls StakingManager.updateAccount() which updates all vaults owned by
 * the connected account in a single transaction.
 *
 * @returns Mutation result with mutate function to trigger compound all
 *
 * @throws {Error} When wallet is not connected
 *
 * @example
 * ```tsx
 * function CompoundAllButton() {
 *   const { mutate: compoundAll, isPending } = useCompoundAll()
 *
 *   return (
 *     <button onClick={() => compoundAll()} disabled={isPending}>
 *       {isPending ? 'Compounding...' : 'Compound All Vaults'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useCompoundAll(): UseMutationResult<
  Address,
  Error,
  void,
  unknown
> {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, 'all', address],
    mutationFn: async (): Promise<Address> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Execute compound all transaction
      const hash = await writeContractAsync({
        address: STAKING_MANAGER.address,
        abi: stakingManagerAbi,
        functionName: 'updateAccount',
        args: [address],
      })

      return hash
    },
  })
}
