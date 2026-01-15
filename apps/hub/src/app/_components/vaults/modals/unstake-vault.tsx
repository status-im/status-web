'use client'

import { useEffect } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@status-im/status-network/components'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { formatUnits, parseUnits } from 'viem'
import { useAccount, useReadContract } from 'wagmi'
import { z } from 'zod'

import { SNTIcon } from '~components/icons'
import { vaultAbi } from '~constants/contracts'
import { STT_TOKEN } from '~constants/index'
import { useVaultStateContext } from '~hooks/useVaultStateContext'
import { useVaultTokenUnStake } from '~hooks/useVaultTokenUnStake'
import { formatSTT } from '~utils/currency'
import { validateVaultAmount } from '~utils/vault'

import { BaseVaultModal } from './base-vault-modal'

import type { Address } from 'viem'

interface UnstakeVaultModalProps {
  onClose: () => void
  vaultAddress: Address
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children?: React.ReactNode
}

const createUnstakeFormSchema = (
  maxBalance: number,
  t: ReturnType<typeof useTranslations>
) => {
  return z.object({
    amount: z
      .string()
      .min(1, t('vault.amount_required'))
      .refine(
        val => {
          const num = Number(val)
          return !isNaN(num) && num > 0
        },
        { message: t('vault.amount_greater_than_zero') }
      )
      .refine(
        val => {
          const num = Number(val)
          return !isNaN(num) && num <= maxBalance
        },
        { message: t('vault.amount_exceeds_max', { max: maxBalance }) }
      ),
  })
}

type FormValues = z.infer<ReturnType<typeof createUnstakeFormSchema>>

/**
 * Modal for unstaking tokens from vault
 */
export function UnstakeVaultModal(props: UnstakeVaultModalProps) {
  const { onClose, vaultAddress, open, onOpenChange, children } = props
  const t = useTranslations()

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
    ? Number(formatUnits(stakedBalance as bigint, STT_TOKEN.decimals))
    : 0

  const form = useForm<FormValues>({
    resolver: zodResolver(createUnstakeFormSchema(maxBalance, t)),
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
    if (validateVaultAmount(value)) {
      form.setValue('amount', value, { shouldValidate: true })
    }
  }

  const handleUnstake = form.handleSubmit(data => {
    try {
      const amountWei = parseUnits(data.amount, STT_TOKEN.decimals)
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
      title={t('stake.unstake_funds')}
      description={t('stake.unstake_description')}
      trigger={children}
    >
      <div className="flex flex-col gap-4">
        <div className="flex w-full flex-col gap-2 px-4 pb-0">
          <p className="text-13 font-medium text-neutral-50">
            {t('stake.amount')}
          </p>

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
                    STT
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
                  {`${t('vault.max')} ${formatSTT(maxBalance ?? 0, { includeSymbol: true })}`}
                </button>
              </div>
            </div>
          </div>
        </div>

        {address && (
          <div className="flex w-full flex-col items-start gap-1 px-4 py-0">
            <p className="text-13 font-medium text-neutral-50">
              {t('stake.unstake_to')}
            </p>
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
            {t('common.cancel')}
          </Button>
          {amountValue && Number(amountValue) > 0 && (
            <Button
              size="40"
              variant="primary"
              onClick={handleUnstake}
              className="flex-1 justify-center"
              disabled={!form.formState.isValid || isPending}
            >
              {isPending ? t('stake.unstaking') : t('stake.unstake')}
            </Button>
          )}
        </div>
      </div>
    </BaseVaultModal>
  )
}
