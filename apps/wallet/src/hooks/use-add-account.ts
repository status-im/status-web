import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useAddAccount = () => {
  const api = useAPI()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['add-account'],
    mutationFn: async ({
      walletId,
      derivationPath,
    }: {
      walletId: string
      derivationPath?: string
    }) => {
      return api.wallet.account.ethereum.add.mutate({
        walletId,
        derivationPath,
      })
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  return {
    addAccount: mutate,
    addAccountAsync: mutateAsync,
    ...result,
  }
}
