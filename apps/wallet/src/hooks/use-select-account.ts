import { useMutation, useQueryClient } from '@tanstack/react-query'

import { useAPI } from '../providers/api-client'

import type { WalletMeta } from '../data/wallet-metadata'

export const useSelectAccount = () => {
  const api = useAPI()
  const queryClient = useQueryClient()

  const { mutate, mutateAsync, ...result } = useMutation({
    mutationKey: ['select-account'],
    mutationFn: async ({
      walletId,
      address,
    }: {
      walletId: string
      address: string
    }) => {
      return api.wallet.account.select.mutate({ walletId, address })
    },
    // Flip the selection instantly; account switching is a frequent action
    // and waiting on the refetch would lag the UI.
    onMutate: async ({ walletId, address }) => {
      await queryClient.cancelQueries({ queryKey: ['wallets'] })
      const previousWallets = queryClient.getQueryData<WalletMeta[]>([
        'wallets',
      ])
      queryClient.setQueryData<WalletMeta[]>(['wallets'], wallets =>
        wallets?.map(wallet =>
          wallet.id === walletId
            ? { ...wallet, selectedAccountAddress: address }
            : wallet,
        ),
      )
      return { previousWallets }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousWallets) {
        queryClient.setQueryData(['wallets'], context.previousWallets)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['wallets'] })
    },
  })

  return {
    selectAccount: mutate,
    selectAccountAsync: mutateAsync,
    ...result,
  }
}
