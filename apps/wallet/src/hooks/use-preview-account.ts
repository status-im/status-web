import { useMutation } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const usePreviewAccount = () => {
  const api = useAPI()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['preview-account'],
    mutationFn: async ({
      mnemonic,
      derivationPath,
    }: {
      mnemonic: string
      derivationPath: string
    }) => {
      return api.wallet.previewAccount.mutate({ mnemonic, derivationPath })
    },
  })

  return {
    previewAccount: mutate,
    previewAccountAsync: mutateAsync,
    ...result,
  }
}
