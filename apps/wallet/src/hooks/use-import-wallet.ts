import { useMutation } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useImportWallet = () => {
  const api = useAPI()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['import-wallet'],
    mutationFn: async ({
      mnemonic,
      password,
    }: {
      mnemonic: string
      password: string
    }) => {
      await api.wallet.import.mutate({
        mnemonic,
        password,
        name: 'Imported Wallet',
      })
    },
  })

  return {
    importWallet: mutate,
    importWalletAsync: mutateAsync,
    ...result,
  }
}
