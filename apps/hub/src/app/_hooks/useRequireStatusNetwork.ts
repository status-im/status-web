import { useEffect } from 'react'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'
import { statusSepolia } from 'wagmi/chains'

/**
 * Hook that auto-switches to Status Network when connected to wrong chain.
 * Returns whether we're on the correct chain.
 */
export function useRequireStatusNetwork() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending } = useSwitchChain()

  const isCorrectChain = chainId === statusSepolia.id

  useEffect(() => {
    if (isConnected && !isCorrectChain && !isPending) {
      switchChain({ chainId: statusSepolia.id })
    }
  }, [isConnected, isCorrectChain, isPending, switchChain])

  return {
    isCorrectChain,
    isConnected,
    isSwitching: isPending,
  }
}
