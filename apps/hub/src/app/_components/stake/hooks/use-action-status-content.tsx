import { useTranslations } from 'next-intl'
import { match } from 'ts-pattern'

import { type VaultState } from '~hooks/useVaultStateMachine'
import { formatSNT, formatSTT } from '~utils/currency'

import { CompoundStatusContent } from '../compound-status-content'
import { type ActionStatusContent } from '../types/action-status'

/**
 * Hook to generate action status dialog content based on vault state
 * Maps vault state machine states to user-facing dialog content
 */
export function useActionStatusContent(
  state: VaultState
): ActionStatusContent | null {
  const t = useTranslations()
  return (
    match<VaultState, ActionStatusContent | null>(state)
      // SIWE flow
      .with({ type: 'siwe', step: 'initialize' }, () => ({
        title: t('action_status.sign_in'),
        description: t('action_status.sign_message'),
        state: 'pending',
        showCloseButton: false,
      }))
      .with({ type: 'siwe', step: 'processing' }, () => ({
        title: t('action_status.signing_in'),
        description: t('action_status.wait_moment'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'siwe', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // Create Vault flow
      .with({ type: 'createVault', step: 'initialize' }, () => ({
        title: t('action_status.ready_to_create_vault'),
        description: t('action_status.sign_message'),
        state: 'pending',
        showCloseButton: false,
      }))
      .with({ type: 'createVault', step: 'processing' }, () => ({
        title: t('action_status.creating_vault'),
        description: t('action_status.wait_moment'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'createVault', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // Increase Allowance flow
      .with({ type: 'increaseAllowance', step: 'initialize' }, () => ({
        title: t('action_status.increase_token_allowance'),
        description: t('action_status.sign_message'),
        state: 'pending',
        showCloseButton: false,
      }))
      .with({ type: 'increaseAllowance', step: 'processing' }, () => ({
        title: t('action_status.increasing_allowance'),
        description: t('action_status.wait_moment'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'increaseAllowance', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
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
          title: t('action_status.ready_to_stake', {
            amount: formatSTT(state.amount ?? 0, { includeSymbol: true }),
          }),
          description: t('action_status.sign_message'),
          state: 'pending',
          showCloseButton: false,
        })
      )

      .with({ type: 'staking', step: 'processing' }, state => ({
        title: t('action_status.staking', {
          amount: formatSTT(state.amount ?? 0, { includeSymbol: true }),
        }),
        description: t('action_status.wait_moment_ellipsis'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'staking', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // Unstaking flow
      .with(
        {
          type: 'unstaking',
          step: 'initialize',
        },
        state => ({
          title: t('action_status.ready_to_unstake', {
            amount: formatSTT(state.amount ?? 0, { includeSymbol: true }),
          }),
          description: t('action_status.sign_message'),
          state: 'pending',
          showCloseButton: false,
        })
      )
      .with({ type: 'unstaking', step: 'processing' }, state => ({
        title: t('action_status.unstaking', {
          amount: formatSTT(state.amount ?? 0, { includeSymbol: true }),
        }),
        description: t('action_status.wait_moment_ellipsis'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'unstaking', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // Withdraw flow (goes directly to processing, no initialize step)
      .with({ type: 'withdraw', step: 'processing' }, state => ({
        title: t('action_status.withdrawing', {
          amount: formatSTT(state.amount ?? 0, { includeSymbol: true }),
        }),
        description: t('action_status.wait_moment_ellipsis'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'withdraw', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // Lock flow
      .with({ type: 'lock', step: 'initialize' }, () => ({
        title: t('action_status.ready_to_lock'),
        description: t('action_status.sign_message'),
        state: 'pending',
        showCloseButton: false,
      }))
      .with({ type: 'lock', step: 'processing' }, () => ({
        title: t('action_status.locking_vault'),
        description: t('action_status.wait_moment_ellipsis'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'lock', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // compound flow
      .with({ type: 'compound', step: 'initialize' }, () => ({
        state: 'pending',
        showCloseButton: false,
        content: <CompoundStatusContent />,
      }))
      .with({ type: 'compound', step: 'processing' }, state => ({
        title: t('action_status.compounding', {
          amount: formatSNT(state.amount ?? 0),
        }),
        description: t('action_status.wait_moment_ellipsis'),
        state: 'processing',
        showCloseButton: false,
      }))
      .with({ type: 'compound', step: 'rejected' }, () => ({
        title: t('action_status.request_rejected'),
        description: t('action_status.rejected_by_user'),
        state: 'error',
        showCloseButton: true,
      }))

      // Success
      .with({ type: 'success' }, () => ({
        title: t('action_status.success'),
        description: t('action_status.transaction_completed'),
        state: 'success',
        showCloseButton: true,
      }))

      // Idle - no dialog
      .with({ type: 'idle' }, () => null)
      .exhaustive()
  )
}
