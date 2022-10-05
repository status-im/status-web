import React, { createContext, useContext, useEffect, useReducer } from 'react'

import { createClient } from '@status-im/js'

import { Loading } from '../components/loading'

import type { Account, Client, ClientOptions, Community } from '@status-im/js'

const Context = createContext<State | undefined>(undefined)

type State = {
  loading: boolean
  client: Client | undefined
  community: Community['description'] | undefined
  account: Account | undefined
  dispatch?: React.Dispatch<Action>
}

type Action =
  | { type: 'INIT'; client: Client }
  | { type: 'UPDATE_COMMUNITY'; community: Community['description'] }
  | { type: 'SET_ACCOUNT'; account: Account | undefined }

interface Props {
  options: ClientOptions
  children: React.ReactNode
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'INIT': {
      const { client } = action
      return {
        ...state,
        loading: false,
        client,
        account: client.account,
        community: client.community.description,
      }
    }
    case 'UPDATE_COMMUNITY': {
      return { ...state, community: action.community }
    }
    case 'SET_ACCOUNT': {
      return { ...state, account: action.account }
    }
  }
}

export const ProtocolProvider = (props: Props) => {
  const { options, children } = props

  const [state, dispatch] = useReducer(reducer, {
    loading: true,
    client: undefined,
    community: undefined,
    account: undefined,
    dispatch: undefined,
  })

  const { client, loading } = state

  useEffect(() => {
    const loadClient = async () => {
      const client = await createClient(options)

      dispatch({ type: 'INIT', client })
    }

    loadClient()

    // Community public key should not change during the lifetime
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (client) {
      const unsubscribe = [
        client.onAccountChange(account => {
          dispatch({ type: 'SET_ACCOUNT', account })
        }),
        client.community.onChange(community => {
          dispatch({ type: 'UPDATE_COMMUNITY', community })
        }),
      ]

      return () => {
        unsubscribe.forEach(listener => listener())
      }
    }
  }, [client])

  if (loading) {
    return <Loading />
  }

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  )
}

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
