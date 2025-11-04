import { match } from 'ts-pattern'

import { type VaultState } from '~hooks/useVaultStateMachine'
import { formatSNT } from '~utils/currency'

import { CompoundStatusContent } from '../compound-status-content'
import { type ActionStatusContent } from '../types/action-status'

/**
 * Hook to generate action status dialog content based on vault state
 * Maps vault state machine states to user-facing dialog content
 */
export function useActionStatusContent(
  state: VaultState
): ActionStatusContent | null {
  return (
    match<VaultState, ActionStatusContent | null>(state)
      // SIWE flow
      .with({ type: 'siwe', step: 'initialize' }, () => ({
        title: 'Sign in',
        description: 'Please sign the message in your wallet.',
        state: 'pending',
        showCloseButton: true,
      }))
      .with({ type: 'siwe', step: 'processing' }, () => ({
        title: 'Signing in',
        description: 'Wait a moment.',
        state: 'processing',
        showCloseButton: true,
      }))
      .with({ type: 'siwe', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // Create Vault flow
      .with({ type: 'createVault', step: 'initialize' }, () => ({
        title: 'Ready to create new vault',
        description: 'Please sign the message in your wallet.',
        state: 'pending',
        showCloseButton: true,
      }))
      .with({ type: 'createVault', step: 'processing' }, () => ({
        title: 'Creating new vault',
        description: 'Wait a moment.',
        state: 'processing',
        showCloseButton: true,
      }))
      .with({ type: 'createVault', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // Increase Allowance flow
      .with({ type: 'increaseAllowance', step: 'initialize' }, () => ({
        title: 'Increase token allowance',
        description: 'Please sign the message in your wallet.',
        state: 'pending',
        showCloseButton: false,
      }))
      .with({ type: 'increaseAllowance', step: 'processing' }, () => ({
        title: 'Increasing token allowance',
        description: 'Wait a moment.',
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'increaseAllowance', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // Staking flow
      .with(
        {
          type: 'staking',
          step: 'initialize',
        },
        state => ({
          title: `Ready to stake ${formatSNT(state.amount ?? 0, { includeSymbol: true })}`,
          description: 'Please sign the message in your wallet.',
          state: 'pending',
          showCloseButton: true,
        })
      )

      .with({ type: 'staking', step: 'processing' }, state => ({
        title: `Staking ${formatSNT(state.amount ?? 0, { includeSymbol: true })}`,
        description: 'Wait a moment...',
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'staking', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // Withdraw flow (goes directly to processing, no initialize step)
      .with({ type: 'withdraw', step: 'processing' }, state => ({
        title: `Withdrawing ${formatSNT(state.amount ?? 0, { includeSymbol: true })}`,
        description: 'Wait a moment...',
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'withdraw', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // Lock flow
      .with({ type: 'lock', step: 'initialize' }, () => ({
        title: 'Ready to lock vault',
        description: 'Please sign the message in your wallet.',
        state: 'pending',
        showCloseButton: true,
      }))
      .with({ type: 'lock', step: 'processing' }, () => ({
        title: 'Locking vault',
        description: 'Wait a moment...',
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'lock', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // compound flow
      .with({ type: 'compound', step: 'initialize' }, () => ({
        state: 'pending',
        showCloseButton: true,
        content: <CompoundStatusContent />,
      }))
      .with({ type: 'compound', step: 'processing' }, state => ({
        title: `Compounding ${formatSNT(state.amount ?? 0)} points`,
        description: 'Wait a moment...',
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'compound', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'error',
        showCloseButton: true,
      }))

      // Success
      .with({ type: 'success' }, () => ({
        title: 'Success!',
        description: 'Your transaction completed successfully',
        state: 'success',
        showCloseButton: true,
      }))

      // Idle - no dialog
      .with({ type: 'idle' }, () => null)
      .exhaustive()
  )
}
