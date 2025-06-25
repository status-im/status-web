'use client'

import { forwardRef } from 'react'

import { ClearIcon } from '@status-im/icons/20'
import { cva } from 'cva'
import * as Aria from 'react-aria-components'

import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof textareaStyles>

type Props = Aria.TextFieldProps & {
  size?: Variants['size']
  label?: string
  placeholder?: string
  clearable?: boolean
}

const Textarea = (props: Props, ref: React.Ref<HTMLTextAreaElement>) => {
  const {
    size = '40',
    label,
    placeholder,
    inputMode,
    clearable = false,
    maxLength,
    ...fieldProps
  } = props

  return (
    <Aria.TextField {...fieldProps} className="grid gap-2">
      {(label || maxLength) && (
        <div className="grid grid-cols-2">
          <Aria.Label className="text-13 font-medium text-neutral-50 dark:text-neutral-40">
            {label}
          </Aria.Label>

          {maxLength && (
            <Aria.Label className="text-right text-13 font-regular text-neutral-50 dark:text-neutral-40">
              {fieldProps.value?.length}/{maxLength}
            </Aria.Label>
          )}
        </div>
      )}
      <div className="relative">
        <Aria.TextArea
          ref={ref}
          inputMode={inputMode}
          placeholder={placeholder}
          className={textareaStyles({ size, clearable })}
        />
        {clearable && (
          <Aria.Button
            className={clearableButtonStyles({ size })}
            aria-label="Clear input"
            onPress={() => props.onChange?.('')}
          >
            <ClearIcon />
          </Aria.Button>
        )}
      </div>
    </Aria.TextField>
  )
}

const textareaStyles = cva({
  base: [
    'block h-32 w-full min-w-0 flex-1 border border-neutral-20 bg-white-100 px-4 py-2 text-15 text-neutral-100 placeholder-neutral-40 max-sm:text-[1rem]',
    'outline-none focus:border-neutral-40',
    'disabled:border-neutral-20 disabled:opacity-[.3]',
    'invalid:border-danger-50/40',
    'resize-none',

    // dark
    'dark:border-neutral-70 dark:bg-neutral-95 dark:text-white-100 dark:placeholder-neutral-50',
    'dark:invalid:border-danger-50/40',
  ],
  variants: {
    size: {
      '40': 'rounded-12 px-3',
      '32': 'rounded-10 px-2',
    },
    clearable: { true: '' },
  },
})

const clearableButtonStyles = cva({
  base: [
    'absolute top-2 size-5 text-neutral-40 dark:text-neutral-60',
    'outline-none',
  ],
  variants: {
    size: {
      '40': 'right-3',
      '32': 'right-2',
    },
  },
})

const _Textarea = forwardRef(Textarea)

export { _Textarea as Textarea }
export type { Props as TextareaProps }
