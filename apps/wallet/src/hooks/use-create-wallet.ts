import { useMutation } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useCreateWallet = () => {
  const api = useAPI()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['create-wallet'],
    mutationFn: async (password: string) => {
      const { mnemonic } = await api.wallet.add.mutate({
        password,
        name: 'Created Wallet',
      })

      return mnemonic
    },
  })

  return {
    createWallet: mutate,
    createWalletAsync: mutateAsync,
    ...result,
  }
}
