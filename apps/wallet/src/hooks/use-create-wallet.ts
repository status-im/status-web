import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'
import { useRecoveryPhraseBackup } from './use-recovery-phrase-backup'

export const useCreateWallet = () => {
  const api = useAPI()
  const queryClient = useQueryClient()
  const { markAsNeedsBackup } = useRecoveryPhraseBackup()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['create-wallet'],
    mutationFn: async (password: string) => {
      await api.wallet.add.mutate({
        password,
        name: 'Account 1',
      })
      await markAsNeedsBackup()
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
