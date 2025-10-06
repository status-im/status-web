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
 * Parameters for staking to a vault
 */
export interface StakeParams {
  /** Amount to stake in wei */
  amountWei: bigint
  /** Lock period in seconds (0 for no lock) */
  lockPeriod: bigint
  /** Vault address */
  vaultAddress: Address
}

/**
 * Return type for the useVaultStake hook
 */
export type UseVaultStakeReturn = UseMutationResult<
  Address,
  Error,
  StakeParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY_PREFIX = 'vault-stake' as const
const CONFIRMATION_BLOCKS = 1

// ============================================================================
// Mutation Hook
// ============================================================================

/**
 * Mutation hook to stake tokens to a vault
 *
 * Stakes tokens to the StakingManager contract with an optional lock period.
 * Manages the state machine transitions for the staking process.
 *
 * @returns Mutation result with mutate function to trigger staking
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function StakeButton({ amount, lockPeriod }: { amount: bigint, lockPeriod: bigint }) {
 *   const { mutate: stake, isPending } = useVaultStake()
 *
 *   return (
 *     <button
 *       onClick={() => stake({ amountWei: amount, lockPeriod })}
 *       disabled={isPending}
 *     >
 *       {isPending ? 'Staking...' : 'Stake SNT'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With success/error handling
 * ```tsx
 * function StakeManager() {
 *   const { mutate: stake, isPending } = useVaultStake()
 *
 *   const handleStake = (amount: bigint, lockPeriod: bigint) => {
 *     stake(
 *       { amountWei: amount, lockPeriod },
 *       {
 *         onSuccess: (txHash) => {
 *           console.log('Staked successfully! Transaction:', txHash)
 *         },
 *         onError: (error) => {
 *           console.error('Failed to stake:', error)
 *         },
 *       }
 *     )
 *   }
 *
 *   return <StakeForm onSubmit={handleStake} />
 * }
 * ```
 */
export function useVaultTokenStake(): UseVaultStakeReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendVaultEvent, reset: resetVault } = useVaultStateContext()
  const { refetch: refetchAccountVaults } = useAccountVaults()

  return useMutation({
    mutationKey: [MUTATION_KEY_PREFIX, address],
    mutationFn: async ({
      amountWei,
      lockPeriod,
      vaultAddress,
    }: StakeParams): Promise<Address> => {
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

      // Send state machine event to start staking
      sendVaultEvent({
        type: 'START_STAKING',
        amount: formatUnits(amountWei, SNT_TOKEN.decimals),
      })

      try {
        // Execute staking transaction
        const hash = await writeContractAsync({
          chain: statusNetworkTestnet,
          account: address,
          address: vaultAddress,
          abi: vaultAbi,
          functionName: 'stake',
          args: [amountWei, lockPeriod],
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
