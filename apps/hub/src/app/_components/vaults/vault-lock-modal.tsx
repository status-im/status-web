/* eslint-disable import/no-unresolved */
'use client'

import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import * as Dialog from '@radix-ui/react-dialog'
import { ContextTag, Input } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import { CloseIcon, IncorrectIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useSliderConfig } from '../../_hooks/useSliderConfig'
import { useVaultLock } from '../../_hooks/useVaultLock'

import type { HTMLAttributes } from 'react'
import type { Address } from 'viem'

type ActionButton = HTMLAttributes<HTMLButtonElement> & {
  label: string
  disabled?: boolean
}

const createFormSchema = () => {
  return z.object({
    years: z.string(),
    days: z.string(),
  })
}

type FormValues = z.infer<ReturnType<typeof createFormSchema>>

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose: () => void
  vaultAddress: Address
  title: string
  description: string
  children?: React.ReactNode
  // Initial values
  initialYears?: string
  initialDays?: string
  // Boost and unlock info
  boost?: string
  // Info box content
  infoMessage?: string
  // Error validation
  errorMessage?: string | null
  onValidate?: (years: string, days: string) => string | null
  // Footer actions (left to right)
  actions: [ActionButton, ActionButton]
}

const VaultLockConfigModal = (props: Props) => {
  const {
    open,
    onOpenChange,
    onClose,
    children,
    title,
    vaultAddress,
    description,
    initialYears = '0',
    initialDays = '90',
    boost = 'x2.5',
    infoMessage = 'Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks.',
    errorMessage: externalErrorMessage,
    onValidate,
    actions,
  } = props

  const [closeAction, submitAction] = actions

  const { mutate: lockVault } = useVaultLock()
  const { watch, setValue, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(createFormSchema()),
    defaultValues: {
      years: initialYears,
      days: initialDays,
    },
  })

  const { data: sliderConfigQuery } = useSliderConfig()

  const sliderConfig = useMemo(() => {
    // Convert seconds to days
    const SECONDS_PER_DAY = 24 * 60 * 60
    const DAYS_PER_YEAR = 365

    const minSeconds = sliderConfigQuery?.min || 7776000 // fallback: 90 days in seconds
    const maxSeconds = sliderConfigQuery?.max || 126144000 // fallback: 4 years in seconds

    const minDays = Math.round(minSeconds / SECONDS_PER_DAY)
    const maxDays = Math.round(maxSeconds / SECONDS_PER_DAY)

    // Format labels
    const minYears = minDays / DAYS_PER_YEAR
    const maxYears = maxDays / DAYS_PER_YEAR

    const minLabel =
      minYears < 1 ? `${minDays} days` : `${minYears.toFixed(1)} years`
    const maxLabel =
      maxYears < 1 ? `${maxDays} days` : `${Math.round(maxYears)} years`

    return {
      minLabel,
      maxLabel,
      minDays,
      maxDays,
      initialPosition: 50,
    }
  }, [sliderConfigQuery])

  const years = watch('years')
  const days = watch('days')

  // Calculate initial slider value from initialYears and initialDays
  const initialSliderValue =
    parseInt(initialYears || '0') * 365 + parseInt(initialDays || '0')

  const [sliderValue, setSliderValue] = useState(initialSliderValue)

  // Calculate unlock date based on days input
  const calculateUnlockDate = (daysToAdd: number): string => {
    const today = new Date()
    const unlockDate = new Date(today)
    unlockDate.setDate(today.getDate() + daysToAdd)

    const day = String(unlockDate.getDate()).padStart(2, '0')
    const month = String(unlockDate.getMonth() + 1).padStart(2, '0')
    const year = unlockDate.getFullYear()

    return `${day}/${month}/${year}`
  }

  const calculatedUnlockDate = calculateUnlockDate(parseInt(days || '0'))

  // Sync slider with days input value
  useEffect(() => {
    const daysValue = parseInt(days || '0')
    if (!isNaN(daysValue) && daysValue !== sliderValue) {
      setSliderValue(daysValue)
    }
  }, [days, sliderValue])

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen)
    }
    if (!nextOpen) {
      onClose()
    }
  }

  const handleVaultLockOrExtend = async (data: FormValues) => {
    const totalDays = parseInt(data.days || '0')
    const lockPeriodInSeconds = BigInt(totalDays * 24 * 60 * 60)

    // Close the modal first
    onClose()

    // Then trigger the lock transaction
    lockVault({
      lockPeriodInSeconds,
      vaultAddress,
    })
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputDays = parseFloat(e.target.value)
    setSliderValue(inputDays)

    // Convert to years (365 days = 1 year)
    const yearsValue = (inputDays / 365).toFixed(2)

    setValue('years', yearsValue)
    setValue('days', Math.round(inputDays).toString())
  }

  const handleYearsChange = (value: string) => {
    setValue('years', value)

    const yearsValue = parseFloat(value || '0')
    if (!isNaN(yearsValue)) {
      const totalDays = Math.round(yearsValue * 365)
      const clampedDays = Math.max(
        sliderConfig.minDays,
        Math.min(totalDays, sliderConfig.maxDays)
      )

      setSliderValue(clampedDays)
      setValue('days', clampedDays.toString())
    }
  }

  const handleDaysChange = (value: string) => {
    setValue('days', value)

    const inputDays = parseInt(value || '0')
    if (!isNaN(inputDays)) {
      const clampedDays = Math.max(
        sliderConfig.minDays,
        Math.min(inputDays, sliderConfig.maxDays)
      )

      setSliderValue(clampedDays)
      setValue('years', (clampedDays / 365).toFixed(2))
    }
  }

  // Built-in validation based on slider config
  const getValidationError = (): string | null => {
    const yearsValue = parseFloat(years || '0')
    const daysValue = parseInt(days || '0')

    // Check if days is below minimum
    if (daysValue > 0 && daysValue < sliderConfig.minDays) {
      return `Minimum lock time is ${sliderConfig.minLabel}`
    }

    // Check if days is above maximum
    if (daysValue > sliderConfig.maxDays) {
      return `Maximum lock time is ${sliderConfig.maxLabel}`
    }

    // Check if years is below minimum (90 days = 0.246 years approximately)
    const minYears = sliderConfig.minDays / 365
    if (yearsValue > 0 && yearsValue < minYears) {
      return `Minimum lock time is ${sliderConfig.minLabel}`
    }

    // Check if years is above maximum (4 years)
    const maxYears = sliderConfig.maxDays / 365
    if (yearsValue > maxYears) {
      return `Maximum lock time is ${sliderConfig.maxLabel}`
    }

    return null
  }

  // Validate on value change
  const builtInError = getValidationError()
  const customError = onValidate ? onValidate(years, days) : null
  const errorMessage = customError || builtInError
  const displayError = externalErrorMessage || errorMessage
  const hasError = Boolean(displayError)

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <form
            onSubmit={handleSubmit(handleVaultLockOrExtend)}
            className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-20 bg-white-100 shadow-3"
          >
            <Dialog.Close asChild>
              <button
                aria-label="Close"
                className="absolute right-3 top-3 z-50 flex size-8 items-center justify-center rounded-10 border border-[rgba(27,39,61,0.1)] backdrop-blur-[20px] transition-colors hover:bg-neutral-10 focus:outline-none"
              >
                <CloseIcon className="text-neutral-100" />
              </button>
            </Dialog.Close>

            <div className="box-border flex flex-col items-center px-8 pb-4 pt-8">
              <Dialog.Title asChild>
                <div className="flex w-full items-center gap-[6px]">
                  <span className="min-h-px min-w-px shrink-0 grow basis-0 text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-neutral-100">
                    {title}
                  </span>
                </div>
              </Dialog.Title>
              <Dialog.Description asChild>
                <div className="flex w-full flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-neutral-100">
                  <span className="leading-[1.45]">{description}</span>
                </div>
              </Dialog.Description>
            </div>

            <div className="box-border flex flex-col gap-4 px-8 py-4">
              <div className="box-border flex flex-col items-center justify-center px-0 pb-1 pt-0">
                <input
                  type="range"
                  min={sliderConfig.minDays}
                  max={sliderConfig.maxDays}
                  step="any"
                  value={sliderValue}
                  onChange={handleSliderChange}
                  className="h-1 w-full cursor-pointer appearance-none rounded-[37px] bg-[#e7eaee] [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-[#7140fd] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[#7140fd]"
                />
              </div>
              <div className="flex items-start justify-between text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#647084]">
                <span>{sliderConfig.minLabel}</span>
                <span>{sliderConfig.maxLabel}</span>
              </div>
            </div>

            <div className="box-border flex items-center justify-center gap-[2px] px-8 pb-2 pt-4">
              <div className="flex min-h-px min-w-px shrink-0 grow basis-0 gap-2">
                <Input
                  label="Years"
                  value={years}
                  onChange={handleYearsChange}
                  size="40"
                  className={hasError ? 'border-danger-50/40' : ''}
                />
                <div className="box-border flex w-[13px] flex-col items-center justify-center self-stretch px-0 pb-0 pt-[23px]">
                  <span className="w-full text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#647084]">
                    or
                  </span>
                </div>
                <Input
                  label="Days"
                  value={days}
                  onChange={handleDaysChange}
                  size="40"
                  className={hasError ? 'border-danger-50/40' : ''}
                />
              </div>
            </div>

            {hasError && (
              <div
                className="box-border flex flex-col gap-2 px-8 py-0"
                style={{ opacity: hasError ? 1 : 0 }}
              >
                <div className="flex items-center gap-1">
                  <div className="box-border flex items-center justify-center gap-[10px] self-stretch px-0 py-px">
                    <div className="relative overflow-hidden">
                      <IncorrectIcon />
                    </div>
                  </div>
                  <div className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col justify-center text-[13px] font-medium leading-[0] tracking-[-0.039px] text-[#e95460]">
                    <span className="leading-[1.4]">{displayError}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="box-border flex items-center gap-6 px-8 py-4">
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-neutral-100">
                  <span className="leading-[1.45]">Boost:</span>
                </div>
                <ContextTag type="label" size="32">
                  {boost}
                </ContextTag>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-neutral-100">
                  <span className="leading-[1.45]">Unlock:</span>
                </div>
                <ContextTag type="label" size="32">
                  {calculatedUnlockDate}
                </ContextTag>
              </div>
            </div>

            <div className="box-border flex flex-col gap-2 px-8 py-4">
              <div className="box-border flex items-start gap-2 rounded-12 border border-solid border-customisation-blue-50/10 bg-customisation-blue-50/5 px-4 py-[11px]">
                <div className="box-border flex items-start justify-center gap-[10px] self-stretch px-0 py-px">
                  <div className="relative size-4 overflow-hidden">
                    <InfoIcon />
                  </div>
                </div>
                <div className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col justify-center text-[13px] leading-[0] tracking-[-0.039px] text-neutral-100">
                  <span className="leading-[1.4]">{infoMessage}</span>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start bg-[rgba(255,255,255,0.7)] backdrop-blur-[20px]">
              <div className="box-border flex w-full items-center justify-center gap-3 px-4 pb-4 pt-6">
                <Dialog.Close asChild>
                  {/* @ts-expect-error - Button component is not typed */}
                  <Button
                    size="40"
                    variant="outline"
                    type="button"
                    aria-label="Close"
                    className="flex-1 justify-center"
                  >
                    {closeAction.label}
                  </Button>
                </Dialog.Close>
                {/* @ts-expect-error - Button component is not typed */}
                <Button
                  size="40"
                  variant="primary"
                  type="submit"
                  className="flex-1 justify-center"
                  disabled={submitAction.disabled || hasError}
                >
                  {submitAction.label}
                </Button>
              </div>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { VaultLockConfigModal }
// Backward compatibility
export { VaultLockConfigModal as VaultLockModal }
