import { createElement, forwardRef } from 'react'

import { ClearIcon } from '@status-im/icons/20'
import { cva } from 'cva'
import {
  Button as AriaButton,
  Input as AriaInput,
  Label as AriaLabel,
  TextField as AriaTextField,
} from 'react-aria-components'

import type { VariantProps } from 'cva'
import type { Ref } from 'react'
import type {
  InputProps as AriaInputProps,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'

type Variants = VariantProps<typeof inputStyles>

type Props = AriaTextFieldProps & {
  size?: Variants['size']
  label?: string
  meta?: string
  icon?: React.ComponentType<React.ComponentPropsWithoutRef<'svg'>>
  placeholder?: string
  type?: AriaInputProps['type']
  inputMode?: AriaInputProps['inputMode']
  autoComplete: AriaInputProps['autoComplete']
  clearable?: boolean
}

const Input = (props: Props, ref: Ref<HTMLInputElement>) => {
  const {
    size = '40',
    label,
    meta,
    icon = null,
    placeholder,
    type = 'text',
    inputMode,
    autoComplete = 'off',
    clearable = false,
    ...fieldProps
  } = props

  return (
    <AriaTextField {...fieldProps} className="grid gap-2">
      {(label || meta) && (
        <div className="grid grid-cols-2">
          <AriaLabel className="text-13 font-medium text-neutral-50">
            {label}
          </AriaLabel>

          <AriaLabel className="text-right text-13 font-regular text-neutral-50">
            {meta}
          </AriaLabel>
        </div>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-50">
            {createElement(icon)}
          </div>
        )}
        <AriaInput
          ref={ref}
          className={inputStyles({ size, icon: Boolean(icon), clearable })}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
        {clearable && (
          <AriaButton
            className={clearableButtonStyles({ size })}
            aria-label="Clear input"
            onPress={() => props.onChange?.('')}
          >
            <ClearIcon />
          </AriaButton>
        )}
      </div>
    </AriaTextField>
  )
}

const inputStyles = cva({
  base: [
    'block h-10 w-full min-w-0 flex-1 border border-neutral-20 bg-white-100 text-15 text-neutral-100 placeholder-neutral-40',
    'outline-none focus:border-neutral-40',
    'disabled:border-neutral-20 disabled:opacity-30',
    'invalid:border-danger-/40',

    // dark
    'dark:border-neutral-70 dark:bg-neutral-95 dark:text-white-100 dark:placeholder-neutral-50',
    'dark:invalid:border-danger-/40',
  ],
  variants: {
    size: {
      '40': 'h-10 rounded-6 px-4',
      '32': 'rounded-5 h-8 px-3',
    },
    icon: { true: '' },
    clearable: { true: '' },
  },
  compoundVariants: [
    {
      size: '40',
      icon: true,
      className: 'pl-10',
    },
    {
      icon: true,
      size: '32',
      className: 'pl-8',
    },
    {
      size: '40',
      clearable: true,
      className: 'pr-10',
    },
    {
      size: '32',
      clearable: true,
      className: 'pr-8',
    },
  ],
})

const clearableButtonStyles = cva({
  base: [
    'absolute top-1/2 size-5 -translate-y-1/2 text-neutral-40 dark:text-neutral-60',
    'outline-none',
  ],
  variants: {
    size: {
      '40': 'right-3',
      '32': 'right-2',
    },
  },
})

const _Input = forwardRef(Input)

export { _Input as Input }
export type { Props as InputProps }
