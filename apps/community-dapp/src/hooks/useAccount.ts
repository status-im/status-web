import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'
import { config } from '../config'

type Error = {
  name: string
  message: string
  stack?: string
}

export function useAccount() {
  const { error, isLoading, active, switchNetwork, activateBrowserWallet, deactivate, account } = useEthers()
  const [activateError, setActivateError] = useState<Error | undefined>(undefined)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (active && error && !isLoading) {
      setActivateError(error)
    } else if (!error) {
      setActivateError(undefined)
    }
  }, [active, error, isLoading])

  useEffect(() => {
    setIsActive(Boolean(account && !activateError))
  }, [account, activateError])

  useEffect(() => {
    if (activateError?.name === 'ChainIdError') {
      switchNetwork(config.usedappConfig.readOnlyChainId!)
    }
  }, [activateError])

  const connect = async () => {
    setActivateError(undefined)
    activateBrowserWallet()
  }

  const disconnect = async () => {
    setActivateError(undefined)
    deactivate()
  }

  return { connect, disconnect, account, isActive, error: activateError, switchNetwork }
}
