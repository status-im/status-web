import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { type Address, BaseError, parseUnits, zeroAddress } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { usePreDepositStateContext } from './usePreDepositStateContext'

import type { TOKEN } from '~constants/index'

// ============================================================================
// Types
// ============================================================================

/**
 * Parameters for token approval
 */
export interface ApprovePreDepositTokenParams {
  /** Token Address to approve */
  token: TOKEN
  /** Amount of tokens to approve (in token units, not wei) */
  amount: string
  /** Address of the spender (vault) to approve tokens for */
  spenderAddress: Address
}

/**
 * Return type for useApproveToken hook
 */
export type UseApprovePreDepositTokenReturn = UseMutationResult<
  void,
  Error,
  ApprovePreDepositTokenParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'approve-token-deposit' as const

const TRANSACTION_CONFIG = {
  CONFIRMATION_BLOCKS: 1,
} as const

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to approve PreDeposit tokens for a spender (pre-deposit vault).
 *
 * **Approval Process:**
 * 1. Validates wallet connection and parameters
 * 2. Converts amount to wei
 * 3. Calls ERC20 approve function
 * 4. Waits for transaction confirmation
 * 5. Updates state machine with approval status
 *
 * @returns Mutation result with approval function and status
 *
 * @throws {Error} When wallet is not connected
 * @throws {Error} When spender address is invalid
 * @throws {Error} When token address is invalid
 * @throws {Error} When amount is invalid or zero
 * @throws {Error} When transaction is reverted
 *
 * @example
 * Basic usage
 * ```tsx
 * function ApproveButton() {
 *   const { mutate: approveToken, isPending } = useApproveToken()
 *
 *   const handleApprove = () => {
 *     approveToken({
 *       token: SNT_TOKEN,
 *       amount: '100',
 *       spenderAddress: vaultAddress
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleApprove} disabled={isPending}>
 *       {isPending ? 'Approving...' : 'Approve ${SNT_TOKEN.symbol}'}
 *     </button>
 *   )
 * }
 * ```
 *
 * @example
 * With callbacks
 * ```tsx
 * approveToken(
 *   {  token: SNT_TOKEN, amount: '100', spenderAddress: vaultAddress },
 *   {
 *     onSuccess: (txHash) => {
 *       console.log('Approved! Transaction:', txHash)
 *     },
 *     onError: (error) => {
 *       console.error('Approval failed:', error)
 *     },
 *   }
 * )
 * ```
 */
export function useApproveToken(): UseApprovePreDepositTokenReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({
      token,
      amount,
      spenderAddress,
    }: ApprovePreDepositTokenParams): Promise<void> => {
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      if (!spenderAddress || spenderAddress === zeroAddress) {
        throw new Error('Invalid spender address provided')
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error('Amount must be greater than 0')
      }

      const amountWei = parseUnits(amount, token.decimals)

      sendPreDepositEvent({
        type: 'START_APPROVE_TOKEN',
        amount,
      })

      try {
        const hash = await writeContractAsync({
          address: token.address,
          abi: token.abi,
          functionName: 'approve',
          args: [spenderAddress, amountWei],
        })

        sendPreDepositEvent({ type: 'EXECUTE' })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        if (status === 'reverted') {
          throw new Error('Transaction was reverted')
        }

        sendPreDepositEvent({ type: 'COMPLETE', amount })
        toast.positive('Token Allowance has been increased')
      } catch (error) {
        console.error('Failed to approve tokens:', error)
        const message =
          error instanceof BaseError ? error.shortMessage : 'Transaction failed'
        toast.negative(message)
        sendPreDepositEvent({ type: 'REJECT' })
        throw error
      }
    },
  })
}
