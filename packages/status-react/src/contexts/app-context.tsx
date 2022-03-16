import React, { createContext, useContext, useMemo, useReducer } from 'react'

import type { Dispatch, Reducer } from 'react'

type Context = {
  state: State
  dispatch: Dispatch<Action>
}

const AppContext = createContext<Context | undefined>(undefined)

interface State {
  view: 'loading' | 'error' | 'chat' | 'group-chat' | 'channel' | 'new-chat'
  showMembers: boolean
}

type Action =
  | { type: 'NEW_CHAT' }
  | { type: 'SET_CHANNEL'; channelId: string }
  | { type: 'SET_CHAT'; chatId: string }
  | { type: 'TOGGLE_MEMBERS' }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'NEW_CHAT': {
      return { ...state, view: 'new-chat' }
    }
    case 'SET_CHAT': {
      return { ...state, view: 'chat' }
    }
    case 'SET_CHANNEL': {
      return { ...state, view: 'channel' }
    }
    case 'TOGGLE_MEMBERS': {
      return { ...state, showMembers: !state.showMembers }
    }
  }
}

const initialState: State = {
  view: 'channel',
  showMembers: true,
}

interface Props {
  children: React.ReactNode
}

export const AppProvider = (props: Props) => {
  const { children } = props

  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useAppState() {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppState must be used within a AppProvider')
  }

  return context
}
