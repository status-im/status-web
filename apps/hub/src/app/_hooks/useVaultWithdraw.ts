import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { vaultAbi } from '~constants/contracts'
import { SNT_TOKEN, statusNetworkTestnet } from '~constants/index'
import { useMultiplierPointsBalance } from '~hooks/useMultiplierPoints'
import { useStakingVaults } from '~hooks/useStakingVaults'
import { useVaultStateContext } from '~hooks/useVaultStateContext'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for withdrawing from a vault
 */
export interface WithdrawParams {
  /** Amount to withdraw in wei */
  amountWei: bigint
  /** Vault address */
  vaultAddress: Address
  /** Optional callback called immediately after user signs transaction */
  onSigned?: () => void
}

/**
 * Return type for the useVaultWithdraw hook
 */
export type UseVaultWithdrawReturn = UseMutationResult<
  void,
  Error,
  WithdrawParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'vault-withdraw' as const
const CONFIRMATION_BLOCKS = 1

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to withdraw tokens from a vault
 *
 * Withdraws (unstakes) tokens from a vault contract.
 * Manages the state machine transitions for the withdrawal process.
 *
 * **Process Flow:**
 * 1. Validates wallet connection and amount
 * 2. Calls vault.withdraw() and waits for user to sign
 * 3. After signing, sends START_WITHDRAW event → Goes directly to processing state
 * 4. Calls onSigned callback (typically to close modal)
 * 5. Waits for transaction confirmation
 * 6. On success: Refetches data and resets state machine
 * 7. On error: Sends REJECT event → Shows rejected state
 *
 * @returns Mutation result with mutate function to trigger withdrawal
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When amount is invalid
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage with modal closing after sign
 * ```tsx
 * function WithdrawModal({ amount, vaultAddress, onClose }: Props) {
 *   const { mutate: withdraw } = useVaultWithdraw()
 *
 *   const handleWithdraw = () => {
 *     withdraw({
 *       amountWei: amount,
 *       vaultAddress,
 *       onSigned: () => {
 *         // Close modal after user signs in wallet
 *         onClose()
 *       }
 *     })
 *   }
 *
 *   return <button onClick={handleWithdraw}>Withdraw SNT</button>
 * }
 * ```
 */
export function useVaultWithdraw(): UseVaultWithdrawReturn {
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
      onSigned,
    }: WithdrawParams): Promise<void> => {
      // Validate wallet connection
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      // Validate amount
      if (amountWei <= 0n) {
        throw new Error('Amount must be greater than 0')
      }

      try {
        // Execute withdrawal transaction
        const hash = await writeContractAsync({
          chain: statusNetworkTestnet,
          account: address,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'withdraw',
          args: [SNT_TOKEN.address, amountWei],
        })

        // Transaction submitted successfully, send START_WITHDRAW event to show processing state
        sendVaultEvent({
          type: 'START_WITHDRAW',
          amount: formatUnits(amountWei, SNT_TOKEN.decimals),
        })

        // Call onSigned callback to close the modal
        onSigned?.()

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

        // Transaction successful, refetch data and close dialog
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
