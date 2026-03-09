import { useTranslations } from 'next-intl'
import { match } from 'ts-pattern'

import { type PreDepositState } from '~hooks/usePreDepositStateMachine'

import { type ActionStatusContent } from '../../stake/types/action-status'

export function usePreDepositActionStatusContent(
  state: PreDepositState
): ActionStatusContent | null {
  const t = useTranslations()

  const rejectedContent: ActionStatusContent = {
    title: t('action_status.request_rejected'),
    description: t('action_status.rejected_by_user'),
    state: 'error',
    showCloseButton: true,
  }

  const failedContent: ActionStatusContent = {
    title: t('action_status.request_failed'),
    description: t('action_status.transaction_failed_retry'),
    state: 'error',
    showCloseButton: true,
  }

  return match<PreDepositState, ActionStatusContent | null>(state)
    .with({ type: 'idle' }, () => null)

    .with({ type: 'approveToken', step: 'initialize' }, () => ({
      title: t('action_status.increase_token_allowance'),
      description: t('action_status.sign_message'),
      state: 'pending',
      showCloseButton: false,
    }))
    .with({ type: 'approveToken', step: 'processing' }, () => ({
      title: t('action_status.increasing_allowance'),
      description: t('action_status.wait_moment_ellipsis'),
      state: 'processing',
      showCloseButton: false,
    }))
    .with({ type: 'approveToken', step: 'rejected' }, () => rejectedContent)
    .with({ type: 'approveToken', step: 'failed' }, () => failedContent)

    .with({ type: 'preDeposit', step: 'initialize' }, () => ({
      title: t('action_status.ready_to_deposit'),
      description: t('action_status.sign_message'),
      state: 'pending',
      showCloseButton: false,
    }))
    .with({ type: 'preDeposit', step: 'processing' }, () => ({
      title: t('action_status.depositing_funds'),
      description: t('action_status.wait_moment_ellipsis'),
      state: 'processing',
      showCloseButton: false,
    }))
    .with({ type: 'preDeposit', step: 'rejected' }, () => rejectedContent)
    .with({ type: 'preDeposit', step: 'failed' }, () => failedContent)

    .with({ type: 'wrapEth', step: 'initialize' }, () => ({
      title: t('action_status.ready_to_wrap_eth'),
      description: t('action_status.sign_message'),
      state: 'pending',
      showCloseButton: false,
    }))
    .with({ type: 'wrapEth', step: 'processing' }, () => ({
      title: t('action_status.wrapping_eth'),
      description: t('action_status.wait_moment_ellipsis'),
      state: 'processing',
      showCloseButton: false,
    }))
    .with({ type: 'wrapEth', step: 'rejected' }, () => rejectedContent)
    .with({ type: 'wrapEth', step: 'failed' }, () => failedContent)

    .with({ type: 'unlock', step: 'initialize' }, () => ({
      title: t('action_status.ready_to_unlock_vault'),
      description: t('action_status.sign_message'),
      state: 'pending',
      showCloseButton: false,
    }))
    .with({ type: 'unlock', step: 'processing' }, () => ({
      title: t('action_status.unlocking_vault'),
      description: t('action_status.unlock_processing_description'),
      state: 'processing',
      showCloseButton: true,
    }))
    .with({ type: 'unlock', step: 'rejected' }, () => rejectedContent)
    .with({ type: 'unlock', step: 'failed' }, () => failedContent)

    .with({ type: 'claim', step: 'initialize' }, () => ({
      title: t('action_status.ready_to_claim'),
      description: t('action_status.sign_message'),
      state: 'pending',
      showCloseButton: false,
    }))
    .with({ type: 'claim', step: 'processing' }, () => ({
      title: t('action_status.claiming'),
      description: t('action_status.wait_moment_ellipsis'),
      state: 'processing',
      showCloseButton: true,
    }))
    .with({ type: 'claim', step: 'rejected' }, () => rejectedContent)
    .with({ type: 'claim', step: 'failed' }, () => failedContent)
    .exhaustive()
}
