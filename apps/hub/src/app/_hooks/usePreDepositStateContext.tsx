'use client'

import { createContext, useContext } from 'react'

import { usePreDepositStateMachine } from '~hooks/usePreDepositStateMachine'

import type {
  PreDepositEvent,
  PreDepositState,
} from '~hooks/usePreDepositStateMachine'

type PreDepositStateContextType = {
  state: PreDepositState
  send: (event: PreDepositEvent) => void
  reset: () => void
}

const PreDepositStateContext = createContext<PreDepositStateContextType | null>(
  null
)

export const PreDepositStateProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const stateMachine = usePreDepositStateMachine()

  return (
    <PreDepositStateContext.Provider value={stateMachine}>
      {children}
    </PreDepositStateContext.Provider>
  )
}

export const usePreDepositStateContext = () => {
  const context = useContext(PreDepositStateContext)
  if (!context) {
    throw new Error(
      'usePreDepositStateContext must be used within PreDepositStateProvider'
    )
  }
  return context
}
