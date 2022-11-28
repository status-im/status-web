import React, { createContext, useEffect, useReducer } from 'react'

import { createClient } from '@status-im/js'

import { Failed } from '../components/failed'
import { Loading } from '../components/loading'

import type { Account, Client, ClientOptions, Community } from '@status-im/js'

export const Context = createContext<State | undefined>(undefined)

export type State = {
  loading: boolean
  failed: boolean
  client: Client | undefined
  community: Community['description'] | undefined
  account: Account | undefined
  dispatch?: React.Dispatch<Action>
}

export type Action =
  | { type: 'INIT'; client: Client }
  | { type: 'UPDATE_COMMUNITY'; community: Community['description'] }
  | { type: 'SET_ACCOUNT'; account: Account | undefined }
  | { type: 'FAIL' }
  | { type: 'CONNECT'; connected: boolean }

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
    case 'FAIL': {
      return { ...state, failed: true, loading: false }
    }
    case 'CONNECT': {
      return { ...state, loading: !action.connected }
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
    failed: false,
  })

  const { client, loading, failed } = state

  useEffect(() => {
    const loadClient = async () => {
      try {
        const client = await createClient(options)

        dispatch({ type: 'INIT', client })
      } catch (error) {
        console.error(error)

        dispatch({ type: 'FAIL' })
      }
    }

    loadClient()

    // Community public key should not change during the lifetime
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (client) {
      const unsubscribe = [
        client.onConnection(connected => {
          dispatch({ type: 'CONNECT', connected })
        }),
        client.onAccountChange(account => {
          dispatch({ type: 'SET_ACCOUNT', account })
        }),
        client.community.onChange(community => {
          dispatch({ type: 'UPDATE_COMMUNITY', community })
        }),
      ]

      return () => {
        unsubscribe.forEach(fn => fn())
      }
    }
  }, [client])

  if (failed) {
    return <Failed />
  }

  if (loading) {
    return <Loading />
  }

  return (
    <Context.Provider value={{ ...state, dispatch }}>
      {children}
    </Context.Provider>
  )
}
