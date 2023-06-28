import { useContext } from 'react'

import { Context } from './provider'

import type { Action, State } from './provider'
import type { Client, Community } from '@status-im/js'
import type React from 'react'

export function useProtocol() {
  const context = useContext(Context)

  if (!context) {
    throw new Error(`useProtocol must be used within a ProtocolProvider`)
  }

  // we enforce initialization of client before rendering children
  return context as State & {
    client: Client
    community: Community['description']
    dispatch: React.Dispatch<Action>
  }
}
