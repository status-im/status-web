import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address, type Hash } from 'viem'
import { useAccount, useConfig, useReadContract, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { vaultAbi } from '~constants/contracts'
import { statusNetworkTestnet } from '~constants/index'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useVaultStateContext } from '~hooks/useVaultStateContext'
import { shortenAddress } from '~utils/address'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for locking a vault
 */
export interface LockVaultParams {
  /**
   * Increased lock duration in seconds
   * The smart contract's _calculateLock handles all calculations:
   * - New lock end = max(currentLockEnd, now) + increasedLockSeconds
   * - Delta MP calculation
   * - Validation (min/max periods, MP overflow)
   */
  lockPeriodInSeconds: bigint
}

/**
 * Return type for the useLockVault hook
 */
export type UseLockVaultReturn = UseMutationResult<
  Hash,
  Error,
  LockVaultParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'lock-vault' as const

const TRANSACTION_CONFIG = {
  CONFIRMATION_BLOCKS: 1,
} as const

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generates a success toast message based on the lock operation performed
 *
 * @param vaultAddress - The vault address that was locked/extended
 * @param wasAlreadyLocked - True if extending an existing lock, false if creating a new lock
 * @returns Formatted success message for the toast notification
 */
const formatLockSuccessMessage = (
  vaultAddress: Address,
  wasAlreadyLocked: boolean
): string => {
  if (wasAlreadyLocked) {
    return 'Lock time extended successfully'
  }

  return `Vault ${shortenAddress(vaultAddress)} has been locked`
}

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to lock or extend a staking vault's lock period
 *
 * **Locking Process:**
 * Locks a vault for a specified duration to increase the boost multiplier.
 * The longer the lock period, the higher the multiplier (max 9x).
 *
 * **How it works:**
 * - Always pass the increased lock duration in seconds
 * - The smart contract's `_calculateLock` function handles all calculations internally:
 *   - New lock end = max(currentLockEnd, now) + increasedLockSeconds
 *   - Delta MP = _bonusMP(balance, increasedLockSeconds)
 *   - Validation (min/max periods, MP overflow checks)
 *
 * **Process Flow:**
 * 1. Validates wallet connection and lock period
 * 2. Sends START_LOCK event to state machine
 * 3. Calls `Vault.lock(increasedLockSeconds)` - contract handles the rest
 * 4. Waits for transaction confirmation
 * 5. Updates state machine and refetches vaults
 * 6. Shows success toast notification
 *
 * @returns Mutation result with mutate function to trigger vault lock
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When lock period is invalid (zero or negative)
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Locking or extending a vault for 30 days
 * ```tsx
 * function LockButton({ vaultAddress }: Props) {
 *   const { mutate: lockVault, isPending } = useLockVault(vaultAddress)
 *
 *   const handleLock = () => {
 *     const thirtyDaysInSeconds = BigInt(30 * 24 * 60 * 60)
 *     lockVault({
 *       lockPeriodInSeconds: thirtyDaysInSeconds,
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleLock} disabled={isPending}>
 *       {isPending ? 'Locking...' : 'Lock for 30 days'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useLockVault(vaultAddress: Address): UseLockVaultReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const { refetch: refetchStakingVaults } = useStakingVaults()
  const toast = useToast()

  // Read current lockUntil to determine if vault is already locked
  const { data: currentLockUntil } = useReadContract({
    abi: vaultAbi,
    address: vaultAddress,
    functionName: 'lockUntil',
  }) as { data: bigint | undefined }

  return useMutation({
    mutationKey: [MUTATION_KEY, vaultAddress, address],
    mutationFn: async ({
      lockPeriodInSeconds,
    }: LockVaultParams): Promise<Hash> => {
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

      // Notify state machine of lock start
      sendVaultEvent({ type: 'START_LOCK' })

      try {
        // Call Vault.lock with the increased lock duration in seconds
        // The smart contract's _calculateLock handles all the math
        const hash = await writeContractAsync({
          chain: statusNetworkTestnet,
          account: address,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'lock',
          args: [lockPeriodInSeconds],
        })

        // Transaction submitted, notify state machine
        sendVaultEvent({ type: 'SIGN' })

        // Wait for transaction confirmation
        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        // Check for transaction revert
        if (status === 'reverted') {
          sendVaultEvent({ type: 'REJECT' })
          throw new Error('Transaction was reverted')
        }

        // Check if vault was already locked before this transaction
        const wasAlreadyLocked = currentLockUntil && currentLockUntil > 0n

        // Show success toast
        toast.positive(
          formatLockSuccessMessage(vaultAddress, !!wasAlreadyLocked)
        )

        // Reset state machine and refetch vaults
        resetVault()
        await refetchStakingVaults()

        return hash
      } catch (error) {
        console.error('Failed to lock vault:', error)
        // Transaction failed or user rejected
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
