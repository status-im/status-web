import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address, type Hash } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { VAULT_FACTORY } from '~constants/index'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useVaultStateContext } from '~hooks/useVaultStateContext'
import { shortenAddress } from '~utils/address'

// ============================================================================
// Types
// ============================================================================

/**
 * Return type for the useCreateVault hook
 */
export type UseCreateVaultReturn = UseMutationResult<Hash, Error, void, unknown>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'create-vault' as const

const DEFAULT_DELAY = 100 as const

const TRANSACTION_CONFIG = {
  CONFIRMATION_BLOCKS: 1,
} as const

// Event signature for VaultCreated(address indexed vault, address indexed owner)
const VAULT_CREATED_EVENT_SIGNATURE =
  '0x5d9c31ffa0fecffd7cf379989a3c7af252f0335e0d2a1320b55245912c781f53' as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extracts the vault address from VaultCreated event logs
 */
function extractVaultAddressFromLogs(
  logs: Array<{ address: Address; topics: readonly string[] }>
): Address {
  const vaultCreatedLog = logs.find(log => {
    // Check if this log is from the vault factory contract
    if (log.address.toLowerCase() !== VAULT_FACTORY.address.toLowerCase()) {
      return false
    }

    // Check if this is the VaultCreated event
    return log.topics[0] === VAULT_CREATED_EVENT_SIGNATURE
  })

  if (!vaultCreatedLog || !vaultCreatedLog.topics[1]) {
    throw new Error('VaultCreated event not found in transaction logs')
  }

  // The vault address is the first indexed parameter (topics[1])
  // Remove the padding from the address (first 24 bytes)
  const paddedAddress = vaultCreatedLog.topics[1] as `0x${string}`
  return `0x${paddedAddress.slice(26)}` as Address
}

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to create a new staking vault
 *
 * **Creation Process:**
 * 1. Calls VaultFactory.createVault()
 * 2. Waits for transaction confirmation
 * 3. Extracts the new vault address from event logs
 * 4. Updates state machine and refetches vaults
 * 5. Shows success toast notification
 *
 * @returns Mutation result with mutate function to trigger vault creation
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When transaction is reverted
 * @throws {Error} When vault address cannot be extracted
 *
 * @example
 * Basic usage
 * ```tsx
 * function CreateVaultButton() {
 *   const { mutate: createVault, isPending } = useCreateVault()
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
 * With success handling
 * ```tsx
 * const { mutate: createVault } = useCreateVault()
 *
 * createVault(undefined, {
 *   onSuccess: (txHash) => {
 *     console.log('Vault created! Transaction:', txHash)
 *   },
 *   onError: (error) => {
 *     console.error('Failed to create vault:', error)
 *   },
 * })
 * ```
 */
export function useCreateVault(): UseCreateVaultReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const { refetch: refetchStakingVaults } = useStakingVaults()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const config = useConfig()
  const toast = useToast()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async (): Promise<Hash> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Notify state machine of vault creation start
      sendVaultEvent({ type: 'START_CREATE_VAULT' })

      try {
        // Execute vault creation transaction
        const hash = await writeContractAsync({
          address: VAULT_FACTORY.address,
          abi: VAULT_FACTORY.abi,
          functionName: 'createVault',
        })

        // Transaction submitted, notify state machine
        sendVaultEvent({ type: 'SIGN' })

        // Wait for transaction confirmation and get logs
        const { status, logs } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        // Check for transaction revert
        if (status === 'reverted') {
          sendVaultEvent({ type: 'REJECT' })
          throw new Error('Transaction was reverted')
        }

        // Extract the newly created vault address from logs
        const deployedVaultAddress = extractVaultAddressFromLogs(logs)

        // Show success toast
        toast.positive(
          `Vault ${shortenAddress(deployedVaultAddress)} has been created`
        )

        // Small delay to ensure toast is rendered before state reset
        await new Promise(resolve => setTimeout(resolve, DEFAULT_DELAY))

        // Reset state machine and refetch vaults
        resetVault()
        await refetchStakingVaults()

        return hash
      } catch (error) {
        // Transaction failed or user rejected
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
