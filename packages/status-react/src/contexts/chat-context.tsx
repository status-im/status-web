import React, { createContext, useContext, useMemo, useReducer } from 'react'

import type { Dispatch, Reducer } from 'react'

type Context = {
  state: State
  dispatch: Dispatch<Action>
}

const ChatContext = createContext<Context | undefined>(undefined)

// TODO: Take from generated protobuf
export interface Message {
  type: 'text' | 'image' | 'image-text'
  text?: string
}

interface State {
  message?: Message
}

type Action =
  | { type: 'SET_REPLY'; message?: Message }
  | { type: 'CANCEL_REPLY' }

const reducer: Reducer<State, Action> = (state, action) => {
  switch (action.type) {
    case 'SET_REPLY': {
      return { ...state, message: action.message }
    }
    case 'CANCEL_REPLY': {
      return { ...state, message: undefined }
    }
  }
}

const initialState: State = {
  message: undefined,
}

interface Props {
  children: React.ReactNode
}

export const ChatProvider = (props: Props) => {
  const { children } = props

  const [state, dispatch] = useReducer(reducer, initialState)
  const value = useMemo(() => ({ state, dispatch }), [state])

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
}

export const useChatState = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatState must be used within a ChatProvider')
  }

  return context
}
