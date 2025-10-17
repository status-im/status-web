import { useCallback, useState } from 'react'

import { match } from 'ts-pattern'

import type { Address } from 'viem'

export type PreDepositState =
  | { type: 'idle' }
  | {
      type: 'approveToken'
      step: 'initialize' | 'processing' | 'rejected'
      spender?: Address
      amount?: string
    }
  | {
      type: 'preDeposit'
      step: 'initialize' | 'processing' | 'rejected'
      amount?: string
    }
  | { type: 'success' }

// TODO: Revise Events
export type PreDepositEvent =
  | { type: 'START_APPROVE_TOKEN'; spender?: Address; amount?: string }
  | { type: 'EXECUTE' }
  | { type: 'REJECT' }
  | { type: 'PROCESS'; amount?: string }
  | { type: 'COMPLETE'; amount?: string }
  | { type: 'READY_TO_PRE_DEPOSIT' }
  | { type: 'START_PRE_DEPOSIT'; amount?: string }
  | { type: 'RESET' }

function transition(
  state: PreDepositState,
  event: PreDepositEvent
): PreDepositState {
  return (
    match<[PreDepositState, PreDepositEvent], PreDepositState>([state, event])
      .with(
        [{ type: 'idle' }, { type: 'START_APPROVE_TOKEN' }],
        ([, event]) => ({
          type: 'approveToken',
          step: 'initialize',
          spender: event.spender,
          amount: event.amount,
        })
      )
      .with([{ type: 'idle' }, { type: 'START_PRE_DEPOSIT' }], ([, event]) => ({
        type: 'preDeposit',
        step: 'initialize',
        amount: event.amount,
      }))

      // PreDeposit flow
      .with(
        [{ type: 'preDeposit', step: 'initialize' }, { type: 'EXECUTE' }],
        () => ({
          type: 'preDeposit',
          step: 'processing',
        })
      )
      .with(
        [{ type: 'preDeposit', step: 'initialize' }, { type: 'REJECT' }],
        () => ({
          type: 'preDeposit',
          step: 'rejected',
        })
      )
      .with(
        [{ type: 'preDeposit', step: 'processing' }, { type: 'REJECT' }],
        () => ({
          type: 'preDeposit',
          step: 'rejected',
        })
      )
      .with(
        [{ type: 'preDeposit', step: 'processing' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )
      .with(
        [{ type: 'preDeposit', step: 'rejected' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )

      // Approve Token flow
      .with(
        [{ type: 'approveToken', step: 'initialize' }, { type: 'EXECUTE' }],
        ([state]) => ({
          type: 'approveToken',
          step: 'processing',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'approveToken', step: 'initialize' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'approveToken',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'approveToken', step: 'processing' }, { type: 'COMPLETE' }],
        ([state, event]) => ({
          type: 'approveToken',
          step: 'initialize',
          amount: event.amount || state.amount || '0',
        })
      )
      .with(
        [{ type: 'approveToken', step: 'processing' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'approveToken',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [
          { type: 'approveToken', step: 'rejected' },
          { type: 'START_APPROVE_TOKEN' },
        ],
        ([state, event]) => ({
          type: 'approveToken',
          step: 'initialize',
          amount: event.amount || state.amount,
        })
      )
      .with(
        [{ type: 'approveToken', step: 'rejected' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )
      // Reset from success
      .with([{ type: 'success' }, { type: 'RESET' }], () => ({ type: 'idle' }))

      .otherwise(() => state)
  )
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
