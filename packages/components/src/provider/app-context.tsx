import { createContext, useContext, useReducer } from 'react'

/*
 * CONTEXT
 */
const DispatchContext = createContext<React.Dispatch<Action> | undefined>(
  undefined
)
const StateContext = createContext<State | undefined>(undefined)

/*
 * REDUCER
 */

type State = {
  channelId?: string
}

type Action = { type: 'set-channel'; channelId: string }

const reducer = (_state: State, action: Action): State => {
  switch (action.type) {
    case 'set-channel': {
      return { channelId: action.channelId }
    }
  }
}

type Props = {
  children: React.ReactNode
}

const AppProvider = (props: Props) => {
  const { children } = props

  const [state, dispatch] = useReducer(reducer, { channelId: 'welcome' })

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  )
}

const useAppState = (): State => {
  const context = useContext(StateContext)

  if (context === undefined) {
    throw new Error('useMessagesState must be used within a MessagesProvider')
  }

  return context
}

const useAppDispatch = () => {
  const context = useContext(DispatchContext)

  if (context === undefined) {
    throw new Error(
      'useMessagesDispatch must be used within a MessagesProvider'
    )
  }

  return context
}

export { AppProvider, useAppDispatch, useAppState }
