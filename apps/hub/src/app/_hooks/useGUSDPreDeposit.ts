import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { parseUnits } from 'viem'
import { mainnet } from 'viem/chains'
import { BaseError, useAccount, usePublicClient, useWriteContract } from 'wagmi'

import {
  GENERIC_DEPOSITOR,
  type StablecoinToken,
  STATUS_L2_CHAIN_NICKNAME,
} from '~constants/address'
import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'

import { addressToBytes32 } from './useGUSDUserBalance'

// ============================================================================
// Types
// ============================================================================

export interface GUSDPreDepositParams {
  /** The stablecoin to deposit */
  stablecoin: StablecoinToken
  /** Amount of stablecoin to deposit (in token units, not wei) */
  amount: string
}

export type UseGUSDPreDepositReturn = UseMutationResult<
  void,
  Error,
  GUSDPreDepositParams,
  unknown
>

// ============================================================================
// Constants
// ============================================================================

const MUTATION_KEY = 'gusd-pre-deposit' as const

export const TRANSACTION_CONFIG = {
  CONFIRMATION_BLOCKS: 1,
} as const

// ============================================================================
// Hook
// ============================================================================

/**
 * Mutation hook to deposit stablecoins into the GUSD pre-deposit vault.
 *
 * **Deposit Process:**
 * 1. Validates wallet connection and parameters
 * 2. Converts amount to wei (stablecoin decimals)
 * 3. Calls depositAndPredeposit on GenericDepositor
 * 4. Waits for transaction confirmation
 * 5. Updates state machine with deposit status
 *
 * @returns Mutation result with deposit function and status
 *
 * @example
 * ```tsx
 * function GUSDDepositButton() {
 *   const { mutate: deposit, isPending } = useGUSDPreDeposit()
 *
 *   const handleDeposit = () => {
 *     deposit({
 *       stablecoin: USDC_TOKEN,
 *       amount: '100',
 *     })
 *   }
 *
 *   return (
 *     <button onClick={handleDeposit} disabled={isPending}>
 *       {isPending ? 'Depositing...' : 'Deposit'}
 *     </button>
 *   )
 * }
 * ```
 */
export function useGUSDPreDeposit(): UseGUSDPreDepositReturn {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const publicClient = usePublicClient({ chainId: mainnet.id })
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()
  const t = useTranslations()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({
      stablecoin,
      amount,
    }: GUSDPreDepositParams): Promise<void> => {
      if (!address) {
        throw new Error(t('errors.wallet_not_connected'))
      }

      if (!amount || parseFloat(amount) <= 0) {
        throw new Error(t('errors.amount_greater_than_zero'))
      }

      const amountWei = parseUnits(amount, stablecoin.decimals)
      const remoteRecipient = addressToBytes32(address)

      sendPreDepositEvent({
        type: 'START_APPROVE_TOKEN',
        amount,
      })

      const contractArgs = [
        stablecoin.address,
        amountWei,
        STATUS_L2_CHAIN_NICKNAME,
        remoteRecipient,
      ] as const

      try {
        const estimatedGas = await publicClient?.estimateContractGas({
          address: GENERIC_DEPOSITOR.address,
          abi: GENERIC_DEPOSITOR.abi,
          functionName: 'depositAndPredeposit',
          args: contractArgs,
          account: address,
        })

        const gasLimit = estimatedGas ? (estimatedGas * 120n) / 100n : undefined

        const hash = await writeContractAsync({
          address: GENERIC_DEPOSITOR.address,
          abi: GENERIC_DEPOSITOR.abi,
          functionName: 'depositAndPredeposit',
          args: contractArgs,
          chainId: mainnet.id,
          gas: gasLimit,
        })

        sendPreDepositEvent({ type: 'EXECUTE' })
        toast.positive(t('vault.transaction_submitted'))

        const receipt = await publicClient?.waitForTransactionReceipt({
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        if (receipt?.status === 'reverted') {
          throw new Error(t('errors.transaction_reverted'))
        }

        sendPreDepositEvent({ type: 'COMPLETE', amount })
        toast.positive(
          t('vault.gusd_deposit_successful', {
            amount,
            symbol: stablecoin.symbol,
          })
        )
      } catch (error) {
        console.error('Failed to deposit into GUSD vault:', error)
        sendPreDepositEvent({ type: 'REJECT' })
        const message =
          error instanceof BaseError
            ? error.shortMessage
            : t('errors.transaction_failed')
        toast.negative(message)
        throw error
      }
    },
  })
}
