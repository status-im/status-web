'use client'

import { forwardRef } from 'react'

import { Step } from '@status-im/components'
import { cva } from 'cva'

type Props = {
  index: number
  value: string
  invalid: boolean
  shouldAutoFocus?: boolean
  isLast?: boolean
  onValueChange: (value: string) => void
  onPasteWords: (words: string[]) => void
  onFocusPrevious: () => void
  onFocusNext: () => void
}

const WordInput = forwardRef<HTMLInputElement, Props>((props, ref) => {
  const {
    index,
    value,
    invalid,
    shouldAutoFocus = false,
    isLast = false,
    onValueChange,
    onPasteWords,
    onFocusPrevious,
    onFocusNext,
  } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onValueChange(event.target.value.replace(/\s/g, '').toLowerCase())
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    // On the last input, Enter falls through to the native form submit.
    if (event.key === 'Enter' && isLast) {
      return
    }

    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      if (value !== '') {
        onFocusNext()
      }
      return
    }

    if (event.key === 'Backspace' && value === '') {
      event.preventDefault()
      onFocusPrevious()
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()

    const words = event.clipboardData
      .getData('text')
      .trim()
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)

    if (words.length === 0) {
      return
    }

    if (words.length === 1) {
      onValueChange(words[0])
      return
    }

    onPasteWords(words)
  }

  return (
    <div className={containerStyles({ invalid })}>
      <Step value={index + 1} />
      <input
        ref={ref}
        type="text"
        value={value}
        aria-label={`Word ${index + 1}`}
        aria-invalid={invalid || undefined}
        // eslint-disable-next-line jsx-a11y/no-autofocus -- matches the design; the grid is the sole content of the step
        autoFocus={shouldAutoFocus}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck={false}
        data-1p-ignore
        className="min-w-0 flex-1 bg-transparent text-15 text-neutral-100 outline-none dark:text-white-100"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />
    </div>
  )
})

WordInput.displayName = 'WordInput'

const containerStyles = cva({
  base: [
    'flex h-10 min-w-0 flex-1 items-center gap-2 rounded-12 border px-3 transition-colors',
  ],
  variants: {
    invalid: {
      false: [
        'border-neutral-80/10 focus-within:border-neutral-80/20',
        'dark:border-white-10 dark:focus-within:border-white-20',
      ],
      true: ['border-danger-50/40'],
    },
  },
})

export { WordInput }
