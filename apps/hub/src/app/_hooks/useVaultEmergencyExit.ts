import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query'
import { type Address, formatUnits } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { vaultAbi } from '~constants/contracts'
import { SNT_TOKEN, testnet } from '~constants/index'
import { useVaultStateContext } from '~hooks/useVaultStateContext'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for emergency exit from a vault
 */
export interface EmergencyExitParams {
  /** Amount being withdrawn (for display purposes only) */
  amountWei: bigint
  /** Vault address */
  vaultAddress: Address
  /** Optional callback called immediately after user signs transaction */
  onSigned?: () => void
}

/**
 * Return type for the useVaultEmergencyExit hook
 */
export type UseVaultEmergencyExitReturn = UseMutationResult<
  void,
  Error,
  EmergencyExitParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'vault-emergency-exit' as const
const CONFIRMATION_BLOCKS = 1

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook for emergency exit from a vault
 *
 * Performs emergency withdrawal from a vault contract when emergency mode is enabled.
 * This withdraws ALL staked tokens from the vault to the connected wallet address.
 * Manages the state machine transitions for the withdrawal process.
 *
 * **Process Flow:**
 * 1. Validates wallet connection
 * 2. Calls vault.emergencyExit(address) and waits for user to sign
 * 3. After signing, sends START_WITHDRAW event → Goes directly to processing state
 * 4. Calls onSigned callback (typically to close modal)
 * 5. Waits for transaction confirmation
 * 6. On success: Refetches data and resets state machine
 * 7. On error: Sends REJECT event → Shows rejected state
 *
 * **Important:** emergencyExit withdraws ALL funds from the vault regardless of
 * the amountWei parameter. The amount is only used for display purposes in the UI.
 *
 * @returns Mutation result with mutate function to trigger emergency withdrawal
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage with modal closing after sign
 * ```tsx
 * function EmergencyWithdrawModal({ vaultAddress, stakedAmount, onClose }: Props) {
 *   const { mutate: emergencyExit } = useVaultEmergencyExit()
 *
 *   const handleEmergencyExit = () => {
 *     emergencyExit({
 *       amountWei: stakedAmount,
 *       vaultAddress,
 *       onSigned: () => {
 *         // Close modal after user signs in wallet
 *         onClose()
 *       }
 *     })
 *   }
 *
 *   return <button onClick={handleEmergencyExit}>Emergency Withdraw</button>
 * }
 * ```
 */
export function useVaultEmergencyExit(): UseVaultEmergencyExitReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const queryClient = useQueryClient()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      amountWei,
      vaultAddress,
      onSigned,
    }: EmergencyExitParams): Promise<void> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Send START_WITHDRAW event first to transition state machine to processing
      sendVaultEvent({
        type: 'START_WITHDRAW',
        amount: formatUnits(amountWei, SNT_TOKEN.decimals),
      })

      // Close the modal immediately so the status dialog can show
      onSigned?.()

      try {
        // Execute emergency exit transaction
        // emergencyExit withdraws ALL funds to the specified destination address
        const hash = await writeContractAsync({
          chain: testnet,
          account: address,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'emergencyExit',
          args: [address],
        })

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

        // Transaction successful, invalidate cache to force fresh data from blockchain
        await queryClient.invalidateQueries({
          queryKey: ['staking-vaults'],
        })
        await queryClient.invalidateQueries({
          queryKey: ['multiplier-points-balance'],
        })
        resetVault()
      } catch (error) {
        // Transaction failed or user rejected
        sendVaultEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
