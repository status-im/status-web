import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

import type { apiClient } from '../providers/api-client'

type ImportHardwareInput = Parameters<
  typeof apiClient.wallet.importHardware.mutate
>[0]

export const useImportHardwareWallet = () => {
  const api = useAPI()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['import-hardware-wallet'],
    mutationFn: (input: ImportHardwareInput) =>
      api.wallet.importHardware.mutate(input),
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
