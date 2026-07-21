import { useMutation } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const usePreviewWalletAccount = () => {
  const api = useAPI()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['preview-wallet-account'],
    mutationFn: async ({
      walletId,
      derivationPath,
    }: {
      walletId: string
      derivationPath?: string
    }) => {
      return api.wallet.account.ethereum.preview.mutate({
        walletId,
        derivationPath,
      })
    },
  })

  return {
    previewWalletAccount: mutate,
    previewWalletAccountAsync: mutateAsync,
    ...result,
  }
}
