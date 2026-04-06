'use client'

import { useBlock, useReadContract } from 'wagmi'

import { statusHoodi } from '~constants/chain'
import { stakingManagerAbi, vaultAbi } from '~constants/contracts'
import { STAKING_MANAGER } from '~constants/index'
import { useLockVault } from '~hooks/useLockVault'

import { BaseVaultModal } from '../base-vault-modal'
import { DEFAULT_LOCK_PERIOD } from './constants'
import { LockVaultForm } from './lock-vault-form'

import type { HTMLAttributes } from 'react'
import type { Address } from 'viem'

type ActionButton = HTMLAttributes<HTMLButtonElement> & {
  label: string
  disabled?: boolean
}

interface LockVaultModalProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose: () => void
  vaultAddress: Address
  title: string
  description: string
  children?: React.ReactNode
  initialYears?: string
  initialDays?: string
  infoMessage?: string
  errorMessage?: string | null
  onValidate?: (years: string, days: string) => string | null
  actions: [ActionButton, ActionButton]
}

/**
 * Modal for locking vault to earn multiplier boost
 */
export function LockVaultModal(props: LockVaultModalProps) {
  const {
    open,
    onOpenChange,
    onClose,
    children,
    title,
    vaultAddress,
    description,
    infoMessage,
    errorMessage,
    onValidate,
    actions,
  } = props

  const { mutate: lockVault } = useLockVault(vaultAddress)

  const {
    data: lockUntil,
    isLoading: isLockUntilLoading,
    isFetching: isLockUntilFetching,
  } = useReadContract({
    abi: vaultAbi,
    address: vaultAddress,
    functionName: 'lockUntil',
    chainId: statusHoodi.id,
    query: {
      staleTime: 0,
      refetchOnMount: 'always',
    },
  }) as { data: bigint; isLoading: boolean; isFetching: boolean }

  const { data: latestBlock } = useBlock({
    chainId: statusHoodi.id,
  })

  const { data: vaultData } = useReadContract({
    abi: stakingManagerAbi,
    address: STAKING_MANAGER.address,
    functionName: 'getVault',
    args: [vaultAddress],
    chainId: statusHoodi.id,
  }) as {
    data:
      | {
          stakedBalance: bigint
        }
      | undefined
  }

  const { data: currentMpBalance } = useReadContract({
    abi: stakingManagerAbi,
    address: STAKING_MANAGER.address,
    functionName: 'mpBalanceOf',
    args: [vaultAddress],
    chainId: statusHoodi.id,
  }) as { data: bigint | undefined }

  // Calculate initial values based on current lockUntil for extensions
  // Display timestamp uses Date.now() fallback (only for UI slider position)
  const displayTimestamp =
    latestBlock?.timestamp ?? BigInt(Math.floor(Date.now() / 1000))
  // Contract-critical timestamp: undefined when block data unavailable
  // so the form can apply a larger safety buffer in that case
  const currentTimestamp = latestBlock?.timestamp
  const remainingSeconds =
    lockUntil && lockUntil > displayTimestamp
      ? Number(lockUntil - displayTimestamp)
      : 0
  const remainingDays = Math.floor(remainingSeconds / 86400)
  // Only treat as extension if remaining lock time >= minimum (90 days)
  // Otherwise, the lock is nearly expired and should use new-lock defaults
  const minInitialDays = parseInt(DEFAULT_LOCK_PERIOD.INITIAL_DAYS)
  const isExtending = remainingDays >= minInitialDays

  // Use calculated values for extensions, defaults for new/nearly-expired locks
  const finalInitialDays = isExtending
    ? String(remainingDays)
    : DEFAULT_LOCK_PERIOD.INITIAL_DAYS
  const finalInitialYears = isExtending
    ? (remainingDays / 365).toFixed(2)
    : DEFAULT_LOCK_PERIOD.INITIAL_YEARS

  /**
   * Handle the submit of the lock vault form
   *
   * @param lockPeriodInSeconds - The increased lock duration in seconds
   * The smart contract handles all calculations internally via _calculateLock
   */
  const handleSubmit = (lockPeriodInSeconds: bigint) => {
    // Always pass the duration in seconds
    // The smart contract's _calculateLock function handles:
    // - Calculating delta MP
    // - Calculating new lock end time (max(currentLockEnd, now) + increasedLockSeconds)
    // - Validation (min/max periods, MP overflow checks)
    lockVault({
      lockPeriodInSeconds,
    })
  }

  return (
    <BaseVaultModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title={title}
      description={description}
      trigger={children}
    >
      <LockVaultForm
        key={`${vaultAddress}-${finalInitialDays}-${finalInitialYears}`}
        initialYears={finalInitialYears}
        initialDays={finalInitialDays}
        infoMessage={infoMessage}
        errorMessage={errorMessage}
        onValidate={onValidate}
        onSubmit={handleSubmit}
        onClose={onClose}
        actions={[
          actions[0],
          {
            ...actions[1],
            disabled:
              actions[1].disabled || isLockUntilLoading || isLockUntilFetching,
          },
        ]}
        currentLockUntil={lockUntil as bigint | undefined}
        currentTimestamp={currentTimestamp}
        currentStakedBalance={vaultData?.stakedBalance}
        currentMpBalance={currentMpBalance}
      />
    </BaseVaultModal>
  )
}
