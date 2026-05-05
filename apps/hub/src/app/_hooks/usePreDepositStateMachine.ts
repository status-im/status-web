import { useCallback, useState } from 'react'

type PreDepositStep = 'initialize' | 'processing' | 'rejected' | 'failed'

type PreDepositOperation = 'unlock' | 'claim'

export type PreDepositState =
  | { type: 'idle' }
  | {
      type: PreDepositOperation
      step: PreDepositStep
      amount?: string
    }

export type PreDepositEvent =
  | { type: 'START_UNLOCK'; amount?: string }
  | { type: 'START_CLAIM' }
  | { type: 'EXECUTE' }
  | { type: 'REJECT' }
  | { type: 'FAIL' }
  | { type: 'COMPLETE' }
  | { type: 'RESET' }

function transition(
  state: PreDepositState,
  event: PreDepositEvent
): PreDepositState {
  switch (event.type) {
    case 'START_UNLOCK':
      return { type: 'unlock', step: 'initialize', amount: event.amount }
    case 'START_CLAIM':
      return { type: 'claim', step: 'initialize' }
    case 'EXECUTE':
      if (state.type === 'idle') return state
      return { ...state, step: 'processing' }
    case 'REJECT':
      if (state.type === 'idle') return state
      return { ...state, step: 'rejected' }
    case 'FAIL':
      if (state.type === 'idle') return state
      return { ...state, step: 'failed' }
    case 'COMPLETE':
    case 'RESET':
      return { type: 'idle' }
    default:
      return state
  }
}

export function usePreDepositStateMachine() {
  const [state, setState] = useState<PreDepositState>({ type: 'idle' })

  const send = useCallback((event: PreDepositEvent) => {
    setState(currentState => transition(currentState, event))
  }, [])

  const reset = useCallback(() => {
    send({ type: 'RESET' })
  }, [send])

  return { state, send, reset }
}
