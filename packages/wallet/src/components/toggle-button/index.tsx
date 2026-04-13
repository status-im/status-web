'use client'

import { Switch } from '@status-im/components'

type ToggleButtonProps = {
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  ariaLabel?: string
  disabled?: boolean
}

const ToggleButton = ({
  label,
  checked,
  onCheckedChange,
  ariaLabel,
  disabled = false,
}: ToggleButtonProps) => {
  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel ?? label}
      aria-disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      onKeyDown={event => {
        if (disabled) return
        if (event.key !== 'Enter' && event.key !== ' ') return
        event.preventDefault()
        onCheckedChange(!checked)
      }}
      className={`inline-flex h-8 shrink-0 select-none items-center justify-center gap-2 rounded-10 border border-neutral-30 px-3 text-center text-15 font-medium text-neutral-100 outline-none transition-all hover:border-neutral-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-80 focus-visible:ring-offset-2 pressed:border-neutral-50 dark:border-neutral-70 dark:text-white-100 dark:hover:border-neutral-60 dark:focus-visible:ring-neutral-80 dark:focus-visible:ring-offset-neutral-100 dark:pressed:border-neutral-50 ${
        disabled
          ? 'pointer-events-none cursor-default opacity-[.3] dark:border-neutral-80'
          : ''
      }`}
    >
      <span className="pointer-events-none flex items-center justify-center">
        <Switch
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          tabIndex={-1}
          aria-hidden
        />
      </span>
      {label}
    </div>
  )
}

export { ToggleButton }
export type { ToggleButtonProps }
