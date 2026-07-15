import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useImportWallet = () => {
  const api = useAPI()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['import-wallet'],
    mutationFn: async ({
      mnemonic,
      password,
      derivationPaths,
    }: {
      mnemonic: string
      password?: string
      derivationPaths?: string[]
    }) => {
      return api.wallet.import.mutate({
        mnemonic,
        password,
        derivationPaths,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  return {
    importWallet: mutate,
    importWalletAsync: mutateAsync,
    ...result,
  }
}
