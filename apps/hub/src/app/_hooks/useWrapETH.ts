import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
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
  const t = useTranslations()

  return useMutation({
    mutationKey: ['wrapETH', address],
    mutationFn: async ({ amountWei }: UseWrapETHParams): Promise<void> => {
      if (!address) {
        throw new Error(t('errors.wallet_not_connected'))
      }

      if (amountWei === 0n) {
        throw new Error(t('errors.amount_greater_than_zero'))
      }

      try {
        const hash = await writeContractAsync({
          address: WETH_TOKEN.address,
          abi: wethAbi,
          functionName: 'deposit',
          value: amountWei,
          chainId: mainnet.id,
        })

        const receipt = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
        })

        const { status } = receipt

        if (status === 'reverted') {
          throw new Error(t('errors.transaction_reverted'))
        }

        toast.positive(t('success.eth_wrapped'))
      } catch (error) {
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
