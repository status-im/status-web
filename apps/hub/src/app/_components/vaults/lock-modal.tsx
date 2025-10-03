/* eslint-disable import/no-unresolved */
'use client'

import { useState } from 'react'

import * as Dialog from '@radix-ui/react-dialog'
import { ContextTag, Input } from '@status-im/components'
import { InfoIcon } from '@status-im/icons/16'
import { CloseIcon } from '@status-im/icons/20'
import { Button } from '@status-im/status-network/components'

import type { HTMLAttributes } from 'react'

type ActionButton = HTMLAttributes<HTMLButtonElement> & {
  label: string
  disabled?: boolean
}

type Props = {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onClose: () => void
  title: string
  description: string
  children?: React.ReactNode
  // Slider configuration
  sliderConfig?: {
    minLabel: string
    maxLabel: string
    minDays: number
    maxDays: number
    initialPosition?: number // 0-100 percentage
  }
  // Initial values
  initialYears?: string
  initialDays?: string
  // Boost and unlock info
  boost?: string
  unlockDate?: string
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
    description,
    sliderConfig = {
      minLabel: '1 year',
      maxLabel: '4 years',
      minDays: 365,
      maxDays: 1460,
      initialPosition: 0,
    },
    initialYears = '1',
    initialDays = '365',
    boost = 'x2.5',
    unlockDate = '30/01/2026',
    infoMessage = 'Boost the rate at which you receive Karma. The longer you lock your vault, the higher your boost, and the faster you accumulate Karma. You can add more SNT at any time, but withdrawing your SNT is only possible once the vault unlocks.',
    errorMessage: externalErrorMessage,
    onValidate,
    actions,
  } = props

  const [years, setYears] = useState(initialYears)
  const [days, setDays] = useState(initialDays)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleOpenChange = (nextOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(nextOpen)
    }
    if (!nextOpen) {
      onClose()
    }
  }

  const handleYearsChange = (value: string) => {
    setYears(value)
    if (onValidate) {
      const error = onValidate(value, days)
      setErrorMessage(error)
    }
  }

  const handleDaysChange = (value: string) => {
    setDays(value)
    if (onValidate) {
      const error = onValidate(years, value)
      setErrorMessage(error)
    }
  }

  const displayError = externalErrorMessage || errorMessage
  const hasError = Boolean(displayError)

  return (
    <Dialog.Root open={open} onOpenChange={handleOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-neutral-80/60 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-[440px] -translate-x-1/2 -translate-y-1/2 px-4 focus:outline-none">
          <div className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-20 bg-white-100 shadow-3">
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
                  <p className="min-h-px min-w-px shrink-0 grow basis-0 text-[19px] font-semibold leading-[1.35] tracking-[-0.304px] text-[#09101c]">
                    {title}
                  </p>
                </div>
              </Dialog.Title>
              <Dialog.Description asChild>
                <div className="flex w-full flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-[#09101c]">
                  <p className="leading-[1.45]">{description}</p>
                </div>
              </Dialog.Description>
            </div>

            <div className="box-border flex flex-col gap-4 px-8 py-4">
              <div className="box-border flex flex-col items-center justify-center px-0 pb-1 pt-0">
                <div className="relative mb-[-4px] h-1 w-full rounded-[37px] bg-[#e7eaee]">
                  <div
                    className="absolute top-[-8px] size-5 -translate-x-1/2"
                    style={{
                      left: `calc(${sliderConfig.initialPosition || 0}% ${(sliderConfig.initialPosition || 0) === 0 ? '- 178px' : (sliderConfig.initialPosition || 0) === 100 ? '+ 178px' : ''})`,
                    }}
                  >
                    <div className="size-5 rounded-full bg-[#7140fd]" />
                  </div>
                </div>
              </div>
              <div className="flex items-start justify-between text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#647084]">
                <p>{sliderConfig.minLabel}</p>
                <p>{sliderConfig.maxLabel}</p>
              </div>
            </div>

            <div className="box-border flex items-center justify-center gap-[2px] px-8 pb-2 pt-4">
              <div className="flex min-h-px min-w-px shrink-0 grow basis-0 gap-2">
                <Input
                  label="Years"
                  value={years}
                  onChange={handleYearsChange}
                  size="40"
                />
                <div className="box-border flex w-[13px] flex-col items-center justify-center self-stretch px-0 pb-0 pt-[23px]">
                  <p className="w-full text-[13px] font-medium leading-[1.4] tracking-[-0.039px] text-[#647084]">
                    or
                  </p>
                </div>
                <Input
                  label="Days"
                  value={days}
                  onChange={handleDaysChange}
                  size="40"
                />
              </div>
            </div>

            <div
              className="box-border flex flex-col gap-2 px-8 py-0"
              style={{ opacity: hasError ? 1 : 0 }}
            >
              <div className="flex items-start gap-1">
                <div className="box-border flex items-start justify-center gap-[10px] self-stretch px-0 py-px">
                  <div className="relative size-4 overflow-hidden">
                    <InfoIcon stroke="#E95460" />
                  </div>
                </div>
                <div className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col justify-center text-[13px] font-medium leading-[0] tracking-[-0.039px] text-[#e95460]">
                  <p className="leading-[1.4]">{displayError || '\u00A0'}</p>
                </div>
              </div>
            </div>

            <div className="box-border flex items-center gap-6 px-8 py-4">
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-[#09101c]">
                  <p className="leading-[1.45]">Boost:</p>
                </div>
                <ContextTag type="label" size="32">
                  {boost}
                </ContextTag>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex flex-col justify-center text-[15px] leading-[0] tracking-[-0.135px] text-[#09101c]">
                  <p className="leading-[1.45]">Unlock:</p>
                </div>
                <ContextTag type="label" size="32">
                  {unlockDate}
                </ContextTag>
              </div>
            </div>

            <div className="box-border flex flex-col gap-2 px-8 py-4">
              <div className="box-border flex items-start gap-2 rounded-12 border border-solid border-[rgba(42,74,245,0.1)] bg-[rgba(42,74,245,0.05)] px-4 py-[11px]">
                <div className="box-border flex items-start justify-center gap-[10px] self-stretch px-0 py-px">
                  <div className="relative size-4 overflow-hidden">
                    <InfoIcon />
                  </div>
                </div>
                <div className="flex min-h-px min-w-px shrink-0 grow basis-0 flex-col justify-center text-[13px] leading-[0] tracking-[-0.039px] text-[#09101c]">
                  <p className="leading-[1.4]">{infoMessage}</p>
                </div>
              </div>
            </div>

            <div className="flex w-full flex-col items-start bg-[rgba(255,255,255,0.7)] backdrop-blur-[20px]">
              <div className="box-border flex w-full items-center justify-center gap-3 px-4 pb-4 pt-6">
                {/* @ts-expect-error - Button component is not typed */}
                <Button
                  size="40"
                  variant="outline"
                  onClick={actions[0].onClick}
                  disabled={actions[0].disabled}
                  className="flex-1 justify-center"
                >
                  {actions[0].label}
                </Button>
                {/* @ts-expect-error - Button component is not typed */}
                <Button
                  size="40"
                  variant="primary"
                  onClick={actions[1].onClick}
                  disabled={actions[1].disabled}
                  className="flex-1 justify-center"
                >
                  {actions[1].label}
                </Button>
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export { VaultLockConfigModal }
// Backward compatibility
export { VaultLockConfigModal as VaultLockModal }
