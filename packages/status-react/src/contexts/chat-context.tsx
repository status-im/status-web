import React, { createContext, useContext, useMemo, useReducer } from 'react'

import type { Member, Message } from '../protocol'
import type { Dispatch, Reducer } from 'react'

type Context = {
  state: State
  dispatch: Dispatch<Action>
}

const ChatContext = createContext<Context | undefined>(undefined)

interface State {
  reply?: {
    message: Message
    member: Member
  }
}

type Action =
  | { type: 'SET_REPLY'; message: Message; member: Member }
  | { type: 'DELETE_REPLY' }

const reducer: Reducer<State, Action> = (state, action): State => {
  switch (action.type) {
    case 'SET_REPLY': {
      return {
        ...state,
        reply: {
          message: action.message,
          member: action.member,
        },
      }
    }
    case 'DELETE_REPLY': {
      return { ...initialState }
    }
  }
}

const initialState: State = {
  reply: undefined,
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

export const useChatContext = () => {
  const context = useContext(ChatContext)

  if (!context) {
    throw new Error('useChatState must be used within a ChatProvider')
  }

  return context
}
