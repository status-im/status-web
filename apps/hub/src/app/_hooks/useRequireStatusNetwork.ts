import { useCallback, useEffect, useRef, useState } from 'react'

import { useAccount, useChainId, useSwitchChain } from 'wagmi'

import { statusHoodi } from '~constants/chain'

/**
 * Hook that auto-switches to Status Network when connected to wrong chain.
 * Returns whether we're on the correct chain.
 */
export function useRequireStatusNetwork() {
  const { isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChain, isPending, error } = useSwitchChain()
  const [hasSwitchError, setHasSwitchError] = useState(false)
  const [errorDismissed, setErrorDismissed] = useState(false)
  const wasConnectedRef = useRef(isConnected)

  const isCorrectChain = chainId === statusHoodi.id

  useEffect(() => {
    if (error && !errorDismissed) {
      setHasSwitchError(true)
    }
  }, [error, errorDismissed])

  useEffect(() => {
    if (isCorrectChain) {
      setHasSwitchError(false)
      setErrorDismissed(false)
    }
  }, [isCorrectChain])

  useEffect(() => {
    const wasConnected = wasConnectedRef.current
    wasConnectedRef.current = isConnected

    if (errorDismissed && !wasConnected && isConnected) {
      window.location.reload()
    }
  }, [isConnected, errorDismissed])

  useEffect(() => {
    if (
      isConnected &&
      !isCorrectChain &&
      !isPending &&
      !hasSwitchError &&
      !errorDismissed
    ) {
      switchChain({ chainId: statusHoodi.id })
    }
  }, [
    isConnected,
    isCorrectChain,
    isPending,
    hasSwitchError,
    errorDismissed,
    switchChain,
  ])

  const dismissError = useCallback(() => {
    setHasSwitchError(false)
    setErrorDismissed(true)
  }, [])

  return {
    isCorrectChain,
    isConnected,
    isSwitching: isPending,
    hasSwitchError,
    dismissError,
  }
}
