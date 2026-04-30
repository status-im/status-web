import { useToast } from '@status-im/components'
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { useWallet } from '@/providers/wallet-context'

export function useWalletFlowSuccess(successHref: string) {
  const { setCurrentWallet } = useWallet()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const toast = useToast()

  return async (wallet: { id: string; name: string }, message: string) => {
    await queryClient.invalidateQueries({ queryKey: ['wallets'] })
    setCurrentWallet(wallet.id)
    toast.positive(message)
    await queryClient.invalidateQueries({ queryKey: ['session', 'status'] })
    navigate({ to: successHref })
  }
}
