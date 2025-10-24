'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@status-im/status-network/components'
import { useForm } from 'react-hook-form'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { z } from 'zod'

import { SNTIcon } from '~components/icons'
import { vaultAbi } from '~constants/contracts'
import { SNT_TOKEN } from '~constants/index'
import { useVaultStateContext } from '~hooks/useVaultStateContext'
import { useVaultTokenUnStake } from '~hooks/useVaultTokenUnStake'
import { formatSNT } from '~utils/currency'

import { BaseVaultModal } from './base-vault-modal'

import type { Address } from 'viem'

interface UnstakeVaultModalProps {
  onClose: () => void
  vaultAddress: Address
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const createUnstakeFormSchema = (maxBalance: number) => {
  return z.object({
    amount: z
      .string()
      .min(1, 'Amount is required')
      .refine(
        val => {
          const num = Number(val)
          return !isNaN(num) && num > 0
        },
        { message: 'Amount must be greater than 0' }
      )
      .refine(
        val => {
          const num = Number(val)
          return !isNaN(num) && num <= maxBalance
        },
        { message: `Amount exceeds maximum balance of ${maxBalance} SNT` }
      ),
  })
}

type FormValues = z.infer<ReturnType<typeof createUnstakeFormSchema>>

/**
 * Modal for unstaking tokens from vault
 */
export function UnstakeVaultModal(props: UnstakeVaultModalProps) {
  const { onClose, vaultAddress, open, onOpenChange, children } = props

  const { address } = useAccount()
  const { mutate: unstake, isPending } = useVaultTokenUnStake()
  const { reset: resetVaultState } = useVaultStateContext()

  // Fetch the vault's staked balance
  const { data: stakedBalance } = useReadContract({
    address: vaultAddress,
    abi: vaultAbi,
    functionName: 'amountStaked',
    query: {
      enabled: open && !!vaultAddress,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
      staleTime: 0, // Always consider stale to refetch on open
    },
  })

  const maxBalance = stakedBalance
    ? Number(formatUnits(stakedBalance as bigint, SNT_TOKEN.decimals))
    : 0

  const form = useForm<FormValues>({
    resolver: zodResolver(createUnstakeFormSchema(maxBalance)),
    mode: 'onChange',
    defaultValues: {
      amount: '',
    },
  })

  // Watch the amount field for reactive updates
  const amountValue = form.watch('amount')
  const hasError = !!form.formState.errors.amount

  // Re-validate when max balance changes
  useEffect(() => {
    if (amountValue) {
      form.trigger('amount')
    }
  }, [maxBalance, amountValue, form])

  const handleMaxClick = () => {
    form.setValue('amount', maxBalance.toString(), { shouldValidate: true })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    // Allow only numbers and decimal point
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      form.setValue('amount', value, { shouldValidate: true })
    }
  }

  const handleUnstake = form.handleSubmit(data => {
    try {
      const amountWei = parseUnits(data.amount, SNT_TOKEN.decimals)
      unstake({
        amountWei,
        vaultAddress,
      })
      // Close modal immediately, state machine dialog will show progress
      form.reset()
      onClose()
    } catch (error) {
      console.error('Failed to parse amount:', error)
    }
  })

  const handleCancel = () => {
    form.reset()
    resetVaultState()
    onClose()
  }

  return (
    <BaseVaultModal
      open={open}
      onOpenChange={onOpenChange}
      onClose={onClose}
      title="Unstake funds"
      description="Your tokens will be unstaked and automatically returned to your connected wallet"
      trigger={children}
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-2 px-4 pb-0">
          <p className="text-13 font-medium text-neutral-50">Amount</p>

          <div className="space-y-2">
            <div className="rounded-16 border border-neutral-20 px-4 py-3">
              <div className="flex items-center justify-between">
                <input
                  id="unstake-amount"
                  type="text"
                  inputMode="decimal"
                  {...form.register('amount')}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className={`h-[38px] w-full border-none bg-transparent text-27 font-semibold outline-none placeholder:text-neutral-40 ${
                    hasError ? 'text-danger-50' : 'text-neutral-100'
                  }`}
                />
                <div className="flex items-center gap-1">
                  <SNTIcon />
                  <span className="text-19 font-semibold text-neutral-80">
                    SNT
                  </span>
                </div>
              </div>
              <div className="-mx-4 my-3 h-px w-[calc(100%+32px)] bg-neutral-10" />
              <div className="flex justify-end border-neutral-10 text-13 font-500 text-neutral-50">
                <button
                  type="button"
                  onClick={handleMaxClick}
                  className={`uppercase ${hasError ? 'text-danger-50' : 'text-neutral-100'}`}
                >
                  {`MAX ${formatSNT(maxBalance ?? 0)} SNT`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {address && (
          <div className="flex w-full flex-col items-start gap-1 px-4 py-0">
            <p className="text-13 font-medium text-neutral-50">Unstake to</p>
            <div className="relative w-full rounded-12 border border-neutral-10 bg-white-100 px-[12px] py-[9px] opacity-[40%]">
              <p className="text-15 text-neutral-100">{address}</p>
            </div>
          </div>
        )}

        <div className="flex w-full items-center justify-center gap-3 px-4 pb-4 pt-6">
          <Button
            size="40"
            variant="outline"
            type="button"
            onClick={handleCancel}
            className="flex-1 justify-center"
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            size="40"
            variant="primary"
            onClick={handleUnstake}
            className="flex-1 justify-center"
            disabled={!form.formState.isValid || isPending || !amountValue}
          >
            {isPending ? 'Unstaking...' : 'Unstake'}
          </Button>
        </div>
      </div>
    </BaseVaultModal>
  )
}
