import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { VAULT_FACTORY } from '../../config'
import { shortenAddress } from '../../utils/address'
import { vaultFactoryAbi } from '../contracts'
import { useAccountVaults } from './useAccountVaults'
import { useVaultStateContext } from './vault-state-context'

import type { Address, Hash } from 'viem'

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for the useVaultMutation hook
 */
export type UseVaultMutationReturn = UseMutationResult<
  Address,
  Error,
  void,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'vault' as const

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to create a new vault
 *
 * Creates a new vault via the VaultFactory contract and manages the state
 * machine transitions for the vault creation process.
 *
 * @returns Mutation result with mutate function to trigger vault creation
 *
 * @throws {Error} When wallet is not connected
 *
 * @example
 * ```tsx
 * function CreateVaultButton() {
 *   const { mutate: createVault, isPending } = useVaultMutation()
 *
 *   return (
 *     <button
 *       onClick={() => createVault()}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Creating...' : 'Create Vault'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function CreateVaultManager() {
 *   const { mutate: createVault, isPending } = useVaultMutation()
 *
 *   const handleCreate = () => {
 *     createVault(undefined, {
 *       onSuccess: (txHash) => {
 *         console.log('Vault created! Transaction:', txHash)
 *       },
 *       onError: (error) => {
 *         console.error('Failed to create vault:', error)
 *       },
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleCreate} disabled={isPending}>
 *       Create Vault
 *     </button>
 *   )
 * }
 * ```
 */
export function useVaultMutation(): UseVaultMutationReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const { refetch: refetchAccountVaults } = useAccountVaults()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const config = useConfig()
  const toast = useToast()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, 'create', address],
    mutationFn: async (): Promise<Hash> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Send state machine event to start vault creation
      sendVaultEvent({ type: 'START_CREATE_VAULT' })

      try {
        // Execute vault creation transaction
        const hash = await writeContractAsync({
          address: VAULT_FACTORY.address,
          abi: vaultFactoryAbi,
          functionName: 'createVault',
        })

        // Transaction submitted successfully, transition to processing
        sendVaultEvent({ type: 'SIGN' })

        const { status, logs } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: 1,
        })

        if (status === 'reverted') {
          sendVaultEvent({ type: 'REJECT' })
          throw new Error('Transaction was reverted')
        }

        const vaultCreatedLog = logs.find(log => {
          // First check if this log is from our contract
          if (
            log.address.toLowerCase() !== VAULT_FACTORY.address.toLowerCase()
          ) {
            return false
          }

          // Check if this is the VaultCreated event signature
          // This is the actual signature from the contract
          return (
            log.topics[0] ===
            '0x5d9c31ffa0fecffd7cf379989a3c7af252f0335e0d2a1320b55245912c781f53'
          )
        })

        if (!vaultCreatedLog || !vaultCreatedLog.topics[1]) {
          console.log('Receipt logs:', logs)
          throw new Error('VaultCreated event not found in transaction logs')
        }

        // The vault address is the first indexed parameter
        // Remove the padding from the address (first 24 bytes)
        const paddedAddress = vaultCreatedLog.topics[1] as `0x${string}`
        const deployedVaultAddress = `0x${paddedAddress.slice(26)}` as Address

        // Show toast before resetting state
        toast.positive(
          `Vault ${shortenAddress(deployedVaultAddress)} has been created`
        )

        // Small delay to ensure toast is rendered before state reset
        await new Promise(resolve => setTimeout(resolve, 100))
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
