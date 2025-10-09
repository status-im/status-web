'use client'

import { createContext, useContext } from 'react'

import { useVaultStateMachine } from '~hooks/useVaultStateMachine'

import type { VaultEvent, VaultState } from '~hooks/useVaultStateMachine'

type VaultStateContextType = {
  state: VaultState
  send: (event: VaultEvent) => void
  reset: () => void
}

const VaultStateContext = createContext<VaultStateContextType | null>(null)

export const VaultStateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const stateMachine = useVaultStateMachine()

  return (
    <VaultStateContext.Provider value={stateMachine}>
      {children}
    </VaultStateContext.Provider>
  )
}

export const useVaultStateContext = () => {
  const context = useContext(VaultStateContext)
  if (!context) {
    throw new Error(
      'useVaultStateContext must be used within VaultStateProvider'
    )
  }
  return context
}
