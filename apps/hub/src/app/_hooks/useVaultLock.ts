import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { statusNetworkTestnet } from '../../config/chain'
import { vaultAbi } from '../contracts'
import { useAccountVaults } from './useAccountVaults'
import { useVaultStateContext } from './vault-state-context'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for locking a vault
 */
export interface LockParams {
  /** Lock period in seconds */
  lockPeriodInSeconds: bigint
  /** Vault address */
  vaultAddress: Address
}

/**
 * Return type for the useVaultLock hook
 */
export type UseVaultLockReturn = UseMutationResult<
  Address,
  Error,
  LockParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'vault-lock' as const
const CONFIRMATION_BLOCKS = 1

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to lock a vault
 *
 * Locks a vault for a specified period to increase boost multiplier.
 * Manages the state machine transitions for the lock process.
 *
 * @returns Mutation result with mutate function to trigger vault lock
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When lock period is invalid
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function LockButton({ lockPeriod, vaultAddress }: { lockPeriod: bigint, vaultAddress: Address }) {
 *   const { mutate: lockVault, isPending } = useVaultLock()
 *
 *   return (
 *     <button
 *       onClick={() => lockVault({ lockPeriodInSeconds: lockPeriod, vaultAddress })}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Locking...' : 'Lock Vault'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function LockManager() {
 *   const { mutate: lockVault, isPending } = useVaultLock()
 *
 *   const handleLock = (lockPeriod: bigint, vaultAddress: Address) => {
 *     lockVault(
 *       { lockPeriodInSeconds: lockPeriod, vaultAddress },
 *       {
 *         onSuccess: (txHash) => {
 *           console.log('Locked successfully! Transaction:', txHash)
 *         },
 *         onError: (error) => {
 *           console.error('Failed to lock:', error)
 *         },
 *       }
 *     )
 *   }
 *
 *   return <LockForm onSubmit={handleLock} />
 * }
 * ```
 */
export function useVaultLock(): UseVaultLockReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const { refetch: refetchAccountVaults } = useAccountVaults()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      lockPeriodInSeconds,
      vaultAddress,
    }: LockParams): Promise<Address> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate lock period
      if (lockPeriodInSeconds <= 0n) {
        throw new Error('Lock period must be greater than 0')
      }

      // Send state machine event to start locking
      sendVaultEvent({
        type: 'START_LOCK',
      })

      try {
        // Execute lock transaction
        const hash = await writeContractAsync({
          chain: statusNetworkTestnet,
          account: address,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'lock',
          args: [lockPeriodInSeconds],
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

        // Transaction successful, close dialog by resetting state
        resetVault()
        refetchAccountVaults()
        return hash
      } catch (error) {
        // Transaction failed or user rejected
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
