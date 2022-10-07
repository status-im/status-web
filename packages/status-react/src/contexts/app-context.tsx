import React, { createContext, useContext, useMemo, useReducer } from 'react'

import type { Config } from '../types/config'
import type { Dispatch, Reducer } from 'react'

type Context = {
  state: State
  dispatch: Dispatch<Action>
  options: NonNullable<Config['options']>
}

const AppContext = createContext<Context | undefined>(undefined)

interface State {
  state: 'loading' | 'error'
  showMembers: boolean
}

type Action = { type: 'TOGGLE_MEMBERS' }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'TOGGLE_MEMBERS': {
      return { ...state, showMembers: !state.showMembers }
    }
  }
}

const initialState: State = {
  state: 'loading',
  showMembers: true,
}

interface Props {
  children: React.ReactNode
  options: Config['options']
}

export const AppProvider = (props: Props) => {
  const { children, options } = props

  const [state, dispatch] = useReducer(reducer, initialState)

  const value = useMemo(
    () => ({
      state,
      dispatch,
      options: {
        enableSidebar: options?.enableSidebar ?? true,
        enableMembers: options?.enableMembers ?? true,
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, options]
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppState = () => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppState must be used within a AppProvider')
  }

  return context
}
