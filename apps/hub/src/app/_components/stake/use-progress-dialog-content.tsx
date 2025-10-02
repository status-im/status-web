import { match } from 'ts-pattern'

import type { VaultState } from '../../_hooks/use-vault-state-machine'

export type ProgressDialogState =
  | 'siwe'
  | 'new'
  | 'in-progress'
  | 'failed'
  | 'success'

export type ProgressDialogContent = {
  title: string
  description: string
  state: ProgressDialogState
  showCloseButton: boolean
}

export function useProgressDialogContent(
  state: VaultState
): ProgressDialogContent | null {
  return (
    match<VaultState, ProgressDialogContent | null>(state)
      // SIWE flow
      .with({ type: 'siwe', step: 'initialize' }, () => ({
        title: 'Sign in',
        description: 'Please sign the message in your wallet.',
        state: 'new',
        showCloseButton: true,
      }))
      .with({ type: 'siwe', step: 'processing' }, () => ({
        title: 'Signing in',
        description: 'Wait a moment.',
        state: 'in-progress',
        showCloseButton: true,
      }))
      .with({ type: 'siwe', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'failed',
        showCloseButton: true,
      }))

      // Create Vault flow
      .with({ type: 'createVault', step: 'initialize' }, () => ({
        title: 'Ready to create new vault',
        description: 'Please sign the message in your wallet.',
        state: 'new',
        showCloseButton: true,
      }))
      .with({ type: 'createVault', step: 'processing' }, () => ({
        title: 'Creating new vault',
        description: 'Wait a moment.',
        state: 'in-progress',
        showCloseButton: true,
      }))
      .with({ type: 'createVault', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'failed',
        showCloseButton: true,
      }))

      // Increase Allowance flow
      .with({ type: 'increaseAllowance', step: 'initialize' }, () => ({
        title: 'Increase token allowance',
        description: 'Please sign the message in your wallet.',
        state: 'new',
        showCloseButton: true,
      }))
      .with({ type: 'increaseAllowance', step: 'processing' }, () => ({
        title: 'Increasing token allowance',
        description: 'Wait a moment.',
        state: 'in-progress',
        showCloseButton: false,
      }))
      .with({ type: 'increaseAllowance', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'failed',
        showCloseButton: true,
      }))

      // Staking flow
      .with(
        {
          type: 'staking',
          step: 'initialize',
        },
        state => ({
          title: `Ready to stake ${state.amount || '0'} SNT`,
          description: 'Please sign the message in your wallet.',
          state: 'new',
          showCloseButton: true,
        })
      )

      .with({ type: 'staking', step: 'processing' }, state => ({
        title: `Staking ${state.amount} SNT`,
        description: 'Wait a moment...',
        state: 'in-progress',
        showCloseButton: false,
      }))
      .with({ type: 'staking', step: 'rejected' }, () => ({
        title: 'Request was rejected',
        description: 'Request was rejected by user',
        state: 'failed',
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
