'use client'

import { useReadContract } from 'wagmi'

import { vaultAbi } from '~constants/contracts'
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

  const { data: lockUntil } = useReadContract({
    abi: vaultAbi,
    address: vaultAddress,
    functionName: 'lockUntil',
  }) as { data: bigint }

  // Calculate initial values based on current lockUntil for extensions
  // Only consider it "extending" if the vault is currently locked (lockUntil > now)
  const now = BigInt(Math.floor(Date.now() / 1000))
  const isExtending = lockUntil && lockUntil > now
  const calculatedInitialDays = isExtending
    ? Math.ceil((Number(lockUntil) - Math.floor(Date.now() / 1000)) / 86400)
    : undefined
  const calculatedInitialYears = calculatedInitialDays
    ? (calculatedInitialDays / 365).toFixed(2)
    : undefined

  // Use calculated values for extensions, props for new locks
  const finalInitialDays = isExtending
    ? String(calculatedInitialDays)
    : DEFAULT_LOCK_PERIOD.INITIAL_DAYS
  const finalInitialYears = isExtending
    ? calculatedInitialYears
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
        initialYears={finalInitialYears}
        initialDays={finalInitialDays}
        infoMessage={infoMessage}
        errorMessage={errorMessage}
        onValidate={onValidate}
        onSubmit={handleSubmit}
        onClose={onClose}
        actions={actions}
        currentLockUntil={lockUntil as bigint | undefined}
      />
    </BaseVaultModal>
  )
}
