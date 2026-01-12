import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { mainnet } from 'viem/chains'
import { BaseError, useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { WETH_TOKEN } from '~constants/address'
import { wethAbi } from '~constants/contracts/WETHAbi'

import { TRANSACTION_CONFIG } from './usePreDepositVault'

interface UseWrapETHParams {
  amountWei: bigint
}

export type UseWrapETHRETURN = UseMutationResult<void, Error, UseWrapETHParams>

export function useWrapETH(): UseWrapETHRETURN {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const toast = useToast()

  return useMutation({
    mutationKey: ['wrapETH', address],
    mutationFn: async ({ amountWei }: UseWrapETHParams): Promise<void> => {
      if (!address) {
        throw new Error(
          'Wallet not connected. Please connect your wallet first.'
        )
      }

      if (amountWei === 0n) {
        throw new Error('Amount must be greater than 0')
      }

      try {
        const hash = await writeContractAsync({
          address: WETH_TOKEN.address,
          abi: wethAbi,
          functionName: 'deposit',
          value: amountWei,
          chainId: mainnet.id,
        })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        if (status === 'reverted') {
          throw new Error('Transaction was reverted')
        }

        toast.positive('Successfully wrapped ETH to WETH')
      } catch (error) {
        console.error('Failed to wrap ETH: ', error)
        const message =
          error instanceof BaseError ? error.shortMessage : 'Transaction failed'
        toast.negative(message)
        throw error
      }
    },
  })
}
