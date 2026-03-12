import { useToast } from '@status-im/components'
import { useMutation, type UseMutationResult } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { type Address, BaseError } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'

import { wethAbi } from '~constants/contracts/WETHAbi'
import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'
import { isUserRejection } from '~utils/wallet'

import { TRANSACTION_CONFIG } from './usePreDepositVault'

interface UseWrapETHParams {
  amountWei: bigint
  wethAddress: Address
  chainId: number
}

export type UseWrapETHRETURN = UseMutationResult<void, Error, UseWrapETHParams>

export function useWrapETH(): UseWrapETHRETURN {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()
  const t = useTranslations()

  return useMutation({
    mutationKey: ['wrapETH', address],
    mutationFn: async ({
      amountWei,
      wethAddress,
      chainId,
    }: UseWrapETHParams): Promise<void> => {
      if (!address) {
        throw new Error(t('errors.wallet_not_connected'))
      }

      if (amountWei === 0n) {
        throw new Error(t('errors.amount_greater_than_zero'))
      }

      sendPreDepositEvent({ type: 'START_WRAP_ETH' })

      try {
        const hash = await writeContractAsync({
          address: wethAddress,
          abi: wethAbi,
          functionName: 'deposit',
          value: amountWei,
          chainId,
        })

        sendPreDepositEvent({ type: 'EXECUTE' })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          confirmations: TRANSACTION_CONFIG.CONFIRMATION_BLOCKS,
          timeout: 90_000,
        })

        if (status === 'reverted') {
          throw new Error(t('errors.transaction_reverted'))
        }

        sendPreDepositEvent({ type: 'COMPLETE' })
        toast.positive(t('success.eth_wrapped'))
      } catch (error) {
        const isRejected = isUserRejection(error)
        sendPreDepositEvent({ type: isRejected ? 'REJECT' : 'FAIL' })
        if (!isRejected) {
          const message =
            error instanceof BaseError
              ? error.shortMessage
              : t('errors.transaction_failed')
          toast.negative(message)
        }
        throw error
      }
    },
  })
}
