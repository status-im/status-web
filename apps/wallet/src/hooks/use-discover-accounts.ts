import { useMutation } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

export const useDiscoverAccounts = () => {
  const api = useAPI()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['discover-accounts'],
    mutationFn: async ({ mnemonic }: { mnemonic: string }) => {
      return api.wallet.discoverAccounts.mutate({ mnemonic })
    },
  })

  return {
    discoverAccounts: mutate,
    discoverAccountsAsync: mutateAsync,
    ...result,
  }
}
