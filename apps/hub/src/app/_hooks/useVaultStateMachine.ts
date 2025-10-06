import { useCallback, useState } from 'react'

import { match } from 'ts-pattern'

// State definitions
export type VaultState =
  | { type: 'idle' }
  | { type: 'siwe'; step: 'initialize' | 'processing' | 'rejected' }
  | { type: 'createVault'; step: 'initialize' | 'processing' | 'rejected' }
  | {
      type: 'increaseAllowance'
      step: 'initialize' | 'processing' | 'rejected'
      amount?: string
    }
  | {
      type: 'staking'
      step: 'initialize' | 'processing' | 'rejected'
      amount?: string
    }
  | {
      type: 'withdraw'
      step: 'initialize' | 'processing' | 'rejected'
      amount?: string
    }
  | {
      type: 'lock'
      step: 'initialize' | 'processing' | 'rejected'
    }
  | { type: 'success' }

// Event definitions
export type VaultEvent =
  | { type: 'START_SIWE' }
  | { type: 'START_CREATE_VAULT' }
  | { type: 'START_INCREASE_ALLOWANCE'; amount?: string }
  | { type: 'SIGN' }
  | { type: 'REJECT' }
  | { type: 'PROCESS' }
  | { type: 'COMPLETE'; amount?: string }
  | { type: 'READY_TO_STAKE' }
  | { type: 'START_STAKING'; amount?: string }
  | { type: 'START_WITHDRAW'; amount?: string }
  | { type: 'START_LOCK' }
  | { type: 'RESET' }

// Transition function
function transition(state: VaultState, event: VaultEvent): VaultState {
  return (
    match<[VaultState, VaultEvent], VaultState>([state, event])
      .with([{ type: 'idle' }, { type: 'START_SIWE' }], () => ({
        type: 'siwe',
        step: 'initialize',
      }))
      .with([{ type: 'idle' }, { type: 'START_CREATE_VAULT' }], () => ({
        type: 'createVault',
        step: 'initialize',
      }))
      .with(
        [{ type: 'idle' }, { type: 'START_INCREASE_ALLOWANCE' }],
        ([, event]) => ({
          type: 'increaseAllowance',
          step: 'initialize',
          amount: event.amount,
        })
      )
      .with([{ type: 'idle' }, { type: 'START_STAKING' }], ([, event]) => ({
        type: 'staking',
        step: 'initialize',
        amount: event.amount,
      }))

      // SIWE flow
      .with([{ type: 'siwe', step: 'initialize' }, { type: 'SIGN' }], () => ({
        type: 'siwe',
        step: 'processing',
      }))
      .with([{ type: 'siwe', step: 'initialize' }, { type: 'REJECT' }], () => ({
        type: 'siwe',
        step: 'rejected',
      }))
      .with(
        [{ type: 'siwe', step: 'processing' }, { type: 'COMPLETE' }],
        () => ({
          type: 'success',
        })
      )
      .with([{ type: 'siwe', step: 'processing' }, { type: 'REJECT' }], () => ({
        type: 'siwe',
        step: 'rejected',
      }))
      .with([{ type: 'siwe', step: 'processing' }, { type: 'RESET' }], () => ({
        type: 'idle',
      }))
      .with([{ type: 'siwe', step: 'rejected' }, { type: 'RESET' }], () => ({
        type: 'idle',
      }))

      // Create Vault flow
      .with(
        [{ type: 'createVault', step: 'initialize' }, { type: 'SIGN' }],
        () => ({
          type: 'createVault',
          step: 'processing',
        })
      )
      .with(
        [{ type: 'createVault', step: 'initialize' }, { type: 'REJECT' }],
        () => ({
          type: 'createVault',
          step: 'rejected',
        })
      )
      .with(
        [{ type: 'createVault', step: 'processing' }, { type: 'REJECT' }],
        () => ({
          type: 'createVault',
          step: 'rejected',
        })
      )
      .with(
        [{ type: 'createVault', step: 'processing' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )
      .with(
        [{ type: 'createVault', step: 'rejected' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )

      // Increase Allowance flow
      .with(
        [{ type: 'increaseAllowance', step: 'initialize' }, { type: 'SIGN' }],
        ([state]) => ({
          type: 'increaseAllowance',
          step: 'processing',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'increaseAllowance', step: 'initialize' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'increaseAllowance',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [
          { type: 'increaseAllowance', step: 'processing' },
          { type: 'COMPLETE' },
        ],
        ([state, event]) => ({
          type: 'staking',
          step: 'initialize',
          amount: event.amount || state.amount || '0',
        })
      )
      .with(
        [{ type: 'increaseAllowance', step: 'processing' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'increaseAllowance',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [
          { type: 'increaseAllowance', step: 'rejected' },
          { type: 'START_INCREASE_ALLOWANCE' },
        ],
        ([state, event]) => ({
          type: 'increaseAllowance',
          step: 'initialize',
          amount: event.amount || state.amount,
        })
      )
      .with(
        [{ type: 'increaseAllowance', step: 'rejected' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )

      // Staking flow
      .with(
        [{ type: 'staking', step: 'initialize' }, { type: 'SIGN' }],
        ([state]) => ({
          type: 'staking',
          step: 'processing',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'staking', step: 'processing' }, { type: 'COMPLETE' }],
        () => ({ type: 'success' })
      )
      .with(
        [{ type: 'staking', step: 'processing' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'staking',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'staking', step: 'processing' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )
      .with(
        [{ type: 'staking', step: 'rejected' }, { type: 'START_STAKING' }],
        ([state, event]) => ({
          type: 'staking',
          step: 'initialize',
          amount: event.amount || state.amount,
        })
      )
      .with([{ type: 'staking', step: 'rejected' }, { type: 'RESET' }], () => ({
        type: 'idle',
      }))

      // Withdraw flow
      .with([{ type: 'idle' }, { type: 'START_WITHDRAW' }], ([, event]) => ({
        type: 'withdraw',
        step: 'initialize',
        amount: event.amount,
      }))
      .with(
        [{ type: 'withdraw', step: 'initialize' }, { type: 'SIGN' }],
        ([state]) => ({
          type: 'withdraw',
          step: 'processing',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'withdraw', step: 'initialize' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'withdraw',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'withdraw', step: 'processing' }, { type: 'REJECT' }],
        ([state]) => ({
          type: 'withdraw',
          step: 'rejected',
          amount: state.amount,
        })
      )
      .with(
        [{ type: 'withdraw', step: 'processing' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )
      .with(
        [{ type: 'withdraw', step: 'rejected' }, { type: 'START_WITHDRAW' }],
        ([state, event]) => ({
          type: 'withdraw',
          step: 'initialize',
          amount: event.amount || state.amount,
        })
      )
      .with(
        [{ type: 'withdraw', step: 'rejected' }, { type: 'RESET' }],
        () => ({ type: 'idle' })
      )

      // Lock flow
      .with([{ type: 'idle' }, { type: 'START_LOCK' }], () => ({
        type: 'lock',
        step: 'initialize',
      }))
      .with([{ type: 'lock', step: 'initialize' }, { type: 'SIGN' }], () => ({
        type: 'lock',
        step: 'processing',
      }))
      .with([{ type: 'lock', step: 'initialize' }, { type: 'REJECT' }], () => ({
        type: 'lock',
        step: 'rejected',
      }))
      .with([{ type: 'lock', step: 'processing' }, { type: 'REJECT' }], () => ({
        type: 'lock',
        step: 'rejected',
      }))
      .with([{ type: 'lock', step: 'processing' }, { type: 'RESET' }], () => ({
        type: 'idle',
      }))
      .with(
        [{ type: 'lock', step: 'rejected' }, { type: 'START_LOCK' }],
        () => ({
          type: 'lock',
          step: 'initialize',
        })
      )
      .with([{ type: 'lock', step: 'rejected' }, { type: 'RESET' }], () => ({
        type: 'idle',
      }))

      // Reset from success
      .with([{ type: 'success' }, { type: 'RESET' }], () => ({ type: 'idle' }))

      // Fallback
      .otherwise(() => state)
  )
}

// Hook
export function useVaultStateMachine() {
  const [state, setState] = useState<VaultState>({ type: 'idle' })

  const send = useCallback((event: VaultEvent) => {
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
