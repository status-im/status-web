import { cloneElement, forwardRef } from 'react'

import { ClearIcon } from '@status-im/icons/20'
import { cva } from 'cva'
import * as Aria from 'react-aria-components'

import type { IconElement } from '../types'
import type { VariantProps } from 'cva'

type Variants = VariantProps<typeof inputStyles>

type Props = Aria.TextFieldProps & {
  size?: Variants['size']
  label?: string
  icon?: IconElement
  placeholder?: string
  type?: Aria.InputProps['type']
  inputMode?: Aria.InputProps['inputMode']
  autoComplete?: Aria.InputProps['autoComplete']
  clearable?: boolean
}

const Input = (props: Props, ref: React.Ref<HTMLInputElement>) => {
  const {
    size = '40',
    label,
    icon,
    placeholder,
    type = 'text',
    inputMode,
    autoComplete = 'off',
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
        {icon && (
          <span className={iconStyles({ size })}>{cloneElement(icon)}</span>
        )}
        <Aria.Input
          ref={ref}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={inputStyles({ size, icon: Boolean(icon), clearable })}
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

const inputStyles = cva({
  base: [
    'block h-10 w-full min-w-0 flex-1 border border-neutral-20 bg-white-100 text-15 text-neutral-100 placeholder-neutral-40 max-sm:text-[1rem]',
    'outline-none focus:border-neutral-40',
    'disabled:border-neutral-20 disabled:opacity-30',
    'invalid:border-danger-/40',

    // dark
    'dark:border-neutral-70 dark:bg-neutral-95 dark:text-white-100 dark:placeholder-neutral-50',
    'dark:invalid:border-danger-/40',
  ],
  variants: {
    size: {
      '40': 'h-10 rounded-12 px-3',
      '32': 'h-8 rounded-10 px-2',
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

const iconStyles = cva({
  base: [
    'absolute top-1/2 -translate-y-1/2 text-neutral-50 [&>svg]:size-full',
    'dark:text-neutral-40',
  ],
  variants: {
    size: {
      '40': 'left-3',
      '32': 'left-2',
    },
  },
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
