/* eslint-disable import/no-unresolved */
'use client'

import { useEffect, useMemo, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { ContextTag, Input } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import { IncorrectIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { useSliderConfig } from '~hooks/useSliderConfig'

import { DATE_FORMAT, DEFAULT_LOCK_PERIOD, SECONDS_PER_DAY } from './constants'
import { LockDurationSlider } from './lock-duration-slider'

import type { HTMLAttributes } from 'react'

const DAYS_PER_YEAR = 365

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

interface LockVaultFormProps {
  onSubmit: (lockPeriodInSeconds: bigint) => void
  onClose: () => void
  actions: [ActionButton, ActionButton]
  initialYears?: string
  initialDays?: string
  infoMessage?: string
  errorMessage?: string | null
  onValidate?: (years: string, days: string) => string | null
  /** Current lockUntil timestamp (for vault extensions) */
  currentLockUntil?: bigint
}

/**
 * Form component for vault lock configuration
 */
export function LockVaultForm(props: LockVaultFormProps) {
  const {
    initialYears,
    initialDays,
    infoMessage = 'Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks.',
    errorMessage: externalErrorMessage,
    onValidate,
    onSubmit,
    onClose,
    actions,
    currentLockUntil,
  } = props

  const [closeAction, submitAction] = actions

  const { watch, setValue, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(createFormSchema()),
    defaultValues: {
      years: initialYears || DEFAULT_LOCK_PERIOD.INITIAL_YEARS,
      days: initialDays || DEFAULT_LOCK_PERIOD.INITIAL_DAYS,
    },
  })

  const { data: sliderConfigQuery } = useSliderConfig()

  const sliderConfig = useMemo(() => {
    const minSeconds = sliderConfigQuery?.min || 7776000 // fallback: 90 days in seconds
    const maxSeconds = sliderConfigQuery?.max || 126144000 // fallback: 4 years in seconds

    const minDays = Math.round(minSeconds / SECONDS_PER_DAY)
    const maxDays = Math.round(maxSeconds / SECONDS_PER_DAY)

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

  const initialSliderValue =
    parseInt(initialYears || DEFAULT_LOCK_PERIOD.INITIAL_YEARS) *
      DAYS_PER_YEAR +
    parseInt(initialDays || DEFAULT_LOCK_PERIOD.INITIAL_DAYS)

  const [sliderValue, setSliderValue] = useState(initialSliderValue)

  const calculateUnlockDate = (totalDays: number): string => {
    const totalSeconds = totalDays * SECONDS_PER_DAY
    // Always calculate from today for consistent UX
    const unlockTimestamp = Math.floor(Date.now() / 1000) + totalSeconds

    // Convert to Date for display (multiply by 1000 for milliseconds)
    const unlockDate = new Date(unlockTimestamp * 1000)

    const day = String(unlockDate.getDate()).padStart(
      DATE_FORMAT.PAD_LENGTH,
      DATE_FORMAT.PAD_CHAR
    )
    const month = String(unlockDate.getMonth() + 1).padStart(
      DATE_FORMAT.PAD_LENGTH,
      DATE_FORMAT.PAD_CHAR
    )
    const year = unlockDate.getFullYear()

    return `${day}${DATE_FORMAT.SEPARATOR}${month}${DATE_FORMAT.SEPARATOR}${year}`
  }

  const calculatedUnlockDate = useMemo(() => {
    const daysValue = parseInt(
      days || initialDays || DEFAULT_LOCK_PERIOD.INITIAL_DAYS
    )
    return calculateUnlockDate(daysValue)
  }, [days, initialDays])

  useEffect(() => {
    const daysValue = parseInt(days || DEFAULT_LOCK_PERIOD.INITIAL_DAYS)
    if (!isNaN(daysValue) && daysValue !== sliderValue) {
      setSliderValue(daysValue)
    }
  }, [days, sliderValue])

  const handleVaultLockOrExtend = async (data: FormValues) => {
    const totalDays = parseInt(data.days || DEFAULT_LOCK_PERIOD.INITIAL_DAYS)
    const userDesiredTotalLockSeconds = BigInt(totalDays * SECONDS_PER_DAY)
    const isExtending = currentLockUntil && currentLockUntil > 0n

    let increasedLockSeconds: bigint

    if (isExtending) {
      // When extending: calculate how much additional time to add
      // to reach the user's desired total lock time from now
      const now = BigInt(Math.floor(Date.now() / 1000))
      const currentRemainingSeconds =
        currentLockUntil > now ? currentLockUntil - now : 0n

      // If user wants total lock of X seconds from now, and vault currently locked for Y seconds from now,
      // we need to add (X - Y) seconds
      increasedLockSeconds =
        userDesiredTotalLockSeconds - currentRemainingSeconds

      // Ensure we're adding at least some time (can't decrease lock)
      if (increasedLockSeconds < 0n) {
        increasedLockSeconds = 0n
      }
    } else {
      // New lock: just use the duration as-is
      increasedLockSeconds = userDesiredTotalLockSeconds
    }

    onClose()
    onSubmit(increasedLockSeconds)
  }

  const handleSliderChange = (inputDays: number) => {
    setSliderValue(inputDays)

    const yearsValue = (inputDays / DAYS_PER_YEAR).toFixed(2)

    setValue('years', yearsValue)
    setValue('days', Math.round(inputDays).toString())
  }

  const handleYearsChange = (value: string) => {
    setValue('years', value)

    const yearsValue = parseFloat(value || '0')
    if (!isNaN(yearsValue)) {
      const totalDays = Math.round(yearsValue * DAYS_PER_YEAR)
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

    const inputDays = parseInt(value || DEFAULT_LOCK_PERIOD.INITIAL_DAYS)
    if (!isNaN(inputDays)) {
      const clampedDays = Math.max(
        sliderConfig.minDays,
        Math.min(inputDays, sliderConfig.maxDays)
      )

      setSliderValue(clampedDays)
      setValue('years', (clampedDays / DAYS_PER_YEAR).toFixed(2))
    }
  }

  const getValidationError = (): string | null => {
    const yearsValue = parseFloat(years || DEFAULT_LOCK_PERIOD.INITIAL_YEARS)
    const daysValue = parseInt(days || DEFAULT_LOCK_PERIOD.INITIAL_DAYS)

    if (daysValue > 0 && daysValue < sliderConfig.minDays) {
      return `Minimum lock time is ${sliderConfig.minLabel}`
    }

    if (daysValue > sliderConfig.maxDays) {
      return `Maximum lock time is ${sliderConfig.maxLabel}`
    }

    const minYears = sliderConfig.minDays / DAYS_PER_YEAR
    if (yearsValue > 0 && yearsValue < minYears) {
      return `Minimum lock time is ${sliderConfig.minLabel}`
    }

    const maxYears = sliderConfig.maxDays / DAYS_PER_YEAR
    if (yearsValue > maxYears) {
      return `Maximum lock time is ${sliderConfig.maxLabel}`
    }

    return null
  }

  const builtInError = getValidationError()
  const customError = onValidate ? onValidate(years, days) : null
  const errorMessage = customError || builtInError
  const displayError = externalErrorMessage || errorMessage
  const hasError = Boolean(displayError)

  return (
    <form onSubmit={handleSubmit(handleVaultLockOrExtend)}>
      <LockDurationSlider
        sliderConfig={sliderConfig}
        value={sliderValue}
        onChange={handleSliderChange}
      />

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
            {/* TODO: calculate boost */}
            x2.5
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
          {/* @ts-expect-error - Button component is not typed */}
          <Button
            size="40"
            variant="outline"
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex-1 justify-center"
          >
            {closeAction.label}
          </Button>
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
  )
}
