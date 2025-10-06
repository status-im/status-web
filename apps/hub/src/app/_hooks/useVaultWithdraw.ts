import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address, formatUnits } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { SNT_TOKEN } from '../../config'
import { statusNetworkTestnet } from '../../config/chain'
import { vaultAbi } from '../contracts'
import { useAccountVaults } from './useAccountVaults'
import { useVaultStateContext } from './vault-state-context'

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
}

/**
 * Return type for the useVaultWithdraw hook
 */
export type UseVaultWithdrawReturn = UseMutationResult<
  Address,
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
 * @returns Mutation result with mutate function to trigger withdrawal
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When amount is invalid
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function WithdrawButton({ amount, vaultAddress }: { amount: bigint, vaultAddress: Address }) {
 *   const { mutate: withdraw, isPending } = useVaultWithdraw()
 *
 *   return (
 *     <button
 *       onClick={() => withdraw({ amountWei: amount, vaultAddress })}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Withdrawing...' : 'Withdraw SNT'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function WithdrawManager() {
 *   const { mutate: withdraw, isPending } = useVaultWithdraw()
 *
 *   const handleWithdraw = (amount: bigint, vaultAddress: Address) => {
 *     withdraw(
 *       { amountWei: amount, vaultAddress },
 *       {
 *         onSuccess: (txHash) => {
 *           console.log('Withdrawn successfully! Transaction:', txHash)
 *         },
 *         onError: (error) => {
 *           console.error('Failed to withdraw:', error)
 *         },
 *       }
 *     )
 *   }
 *
 *   return <WithdrawForm onSubmit={handleWithdraw} />
 * }
 * ```
 */
export function useVaultWithdraw(): UseVaultWithdrawReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const { refetch: refetchAccountVaults } = useAccountVaults()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      amountWei,
      vaultAddress,
    }: WithdrawParams): Promise<Address> => {
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

      // Send state machine event to start withdrawal
      sendVaultEvent({
        type: 'START_WITHDRAW',
        amount: formatUnits(amountWei, SNT_TOKEN.decimals),
      })

      try {
        // Execute withdrawal transaction
        const hash = await writeContractAsync({
          chain: statusNetworkTestnet,
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
