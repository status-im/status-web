import { useCallback, useState } from 'react'

import type { Address } from 'viem'

type PreDepositStep = 'initialize' | 'processing' | 'rejected' | 'failed'

type PreDepositOperation =
  | 'approveToken'
  | 'preDeposit'
  | 'wrapEth'
  | 'unlock'
  | 'claim'

export type PreDepositState =
  | { type: 'idle' }
  | {
      type: PreDepositOperation
      step: PreDepositStep
      spender?: Address
      amount?: string
    }

export type PreDepositEvent =
  | { type: 'START_APPROVE_TOKEN'; spender?: Address; amount?: string }
  | { type: 'START_PRE_DEPOSIT'; amount?: string }
  | { type: 'START_WRAP_ETH'; amount?: string }
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
    case 'START_APPROVE_TOKEN':
      return {
        type: 'approveToken',
        step: 'initialize',
        spender: event.spender,
        amount: event.amount,
      }
    case 'START_PRE_DEPOSIT':
      return {
        type: 'preDeposit',
        step: 'initialize',
        amount: event.amount,
      }
    case 'START_WRAP_ETH':
      return {
        type: 'wrapEth',
        step: 'initialize',
        amount: event.amount,
      }
    case 'START_UNLOCK':
      return {
        type: 'unlock',
        step: 'initialize',
        amount: event.amount,
      }
    case 'START_CLAIM':
      return {
        type: 'claim',
        step: 'initialize',
      }
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

  return {
    state,
    send,
    reset,
  }
}
