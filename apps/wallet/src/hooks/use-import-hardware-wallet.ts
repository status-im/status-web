import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useImportHardwareWallet = () => {
  const api = useAPI()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['import-hardware-wallet'],
    mutationFn: async ({
      name,
      vendor,
      address,
      publicKey,
      sourceFingerprint,
    }: {
      name: string
      vendor: string
      address: string
      publicKey: string
      sourceFingerprint?: number
    }) => {
      return api.wallet.importHardware.mutate({
        name,
        vendor,
        address,
        publicKey,
        sourceFingerprint,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  return {
    importHardwareWallet: mutate,
    importHardwareWalletAsync: mutateAsync,
    ...result,
  }
}
