import { useToast } from '@status-im/components'
import { useMutation } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { BaseError } from 'viem'
import { useAccount, useConfig, useWriteContract } from 'wagmi'
import { waitForTransactionReceipt } from 'wagmi/actions'
import { linea } from 'wagmi/chains'

import { DEMO_MODE, markVaultClaimed, useDemoSign } from '~/utils/demo'
import { L2ClaimVaultAbi } from '~constants/contracts/L2ClaimVaultAbi'
import { usePreDepositStateContext } from '~hooks/usePreDepositStateContext'
import { isUserRejection } from '~utils/wallet'

import type { Vault } from '~constants/index'

export interface FulfillClaimParams {
  vault: Vault
}

const MUTATION_KEY = 'fulfill-claim' as const

/**
 * Mutation hook to call `fulfillClaim([])` on the linea L2 ClaimVault.
 *
 * Called with an empty actions array for simple withdrawal.
 */
export function useFulfillClaim() {
  const { address } = useAccount()
  const { writeContractAsync } = useWriteContract()
  const config = useConfig()
  const { send: sendPreDepositEvent } = usePreDepositStateContext()
  const toast = useToast()
  const t = useTranslations()
  // DEMO_MODE — also called when not in demo mode (rules-of-hooks); ignored.
  const signDemo = useDemoSign()

  return useMutation({
    mutationKey: [MUTATION_KEY, address],
    mutationFn: async ({ vault }: FulfillClaimParams): Promise<void> => {
      if (!address) {
        throw new Error(t('errors.wallet_not_connected'))
      }

      if (!DEMO_MODE && !vault.l2ClaimVaultAddress) {
        throw new Error('L2 ClaimVault address not configured')
      }

      sendPreDepositEvent({ type: 'START_CLAIM' })

      try {
        // DEMO_MODE: sign-message instead of broadcasting `fulfillClaim()`.
        if (DEMO_MODE) {
          await signDemo(vault.name, 'claim')
          sendPreDepositEvent({ type: 'EXECUTE' })
          await new Promise(resolve => setTimeout(resolve, 1500))
          markVaultClaimed(vault)
          sendPreDepositEvent({ type: 'COMPLETE' })
          toast.positive(t('vault.claim_successful', { vault: vault.name }))
          return
        }

        const hash = await writeContractAsync({
          address: vault.l2ClaimVaultAddress!,
          abi: L2ClaimVaultAbi,
          functionName: 'fulfillClaim',
          args: [[]],
          chainId: linea.id,
        })

        sendPreDepositEvent({ type: 'EXECUTE' })

        const { status } = await waitForTransactionReceipt(config, {
          hash,
          chainId: linea.id,
          confirmations: 1,
          timeout: 90_000,
        })

        if (status === 'reverted') {
          throw new Error(t('errors.transaction_reverted'))
        }

        sendPreDepositEvent({ type: 'COMPLETE' })
        toast.positive(t('vault.claim_successful', { vault: vault.name }))
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
