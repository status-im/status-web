import { createContext, useContext, useReducer } from 'react'

/*
 * CONTEXT
 */
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
)
const StateContext = createContext<State | null>(null)

/*
 * REDUCER
 */

type State = {
  type: 'edit' | 'reply'
  messageId: string
} | null

type Action =
  | { type: 'edit'; messageId: string }
  | { type: 'reply'; messageId: string }
  | { type: 'cancel' }

const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case 'edit':
      return { type: 'edit', messageId: action.messageId }
    case 'reply':
      return { type: 'reply', messageId: action.messageId }
    case 'cancel':
      return null
  }
}

type Props = {
  children: React.ReactNode
}

const ChatProvider = (props: Props) => {
  const { children } = props

  const [state, dispatch] = useReducer(reducer, null)

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

const useChatState = (): State => {
  const context = useContext(StateContext)

  if (context === undefined) {
    throw new Error('useMessagesState must be used within a MessagesProvider')
  }

  return context
}

const useChatDispatch = () => {
  const context = useContext(DispatchContext)

  if (context === undefined) {
    throw new Error(
      'useMessagesDispatch must be used within a MessagesProvider'
    )
  }

  return context
}

export { ChatProvider, useChatDispatch, useChatState }
