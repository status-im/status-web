import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'
import { useRecoveryPhraseBackup } from './use-recovery-phrase-backup'

export const useCreateWallet = () => {
  const api = useAPI()
  const queryClient = useQueryClient()
  const { markAsNeedsBackup } = useRecoveryPhraseBackup()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['create-wallet'],
    mutationFn: async (password?: string) => {
      const createdWallet = await api.wallet.add.mutate({
        password,
      })
      await markAsNeedsBackup()
      return createdWallet
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  return {
    createWallet: mutate,
    createWalletAsync: mutateAsync,
    ...result,
  }
}
