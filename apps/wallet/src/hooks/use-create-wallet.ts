import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useCreateWallet = () => {
  const api = useAPI()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['create-wallet'],
    mutationFn: async (password: string) => {
      const { mnemonic } = await api.wallet.add.mutate({
        password,
        name: 'Account 1',
      })

      return mnemonic
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
