import { createElement, forwardRef } from 'react'

import { cva } from 'cva'
import {
  Input as AriaInput,
  Label as AriaLabel,
  TextField as AriaTextField,
} from 'react-aria-components'

import type { IconProps } from '@status-im/icons'
import type { VariantProps } from 'cva'
import type { Ref } from 'react'
import type {
  InputProps as AriaInputProps,
  TextFieldProps as AriaTextFieldProps,
} from 'react-aria-components'

type Variants = VariantProps<typeof styles>

type Props = AriaTextFieldProps & {
  size?: Variants['size']
  label?: string
  meta?: string
  icon?: React.ComponentType<IconProps>
  placeholder?: string
  type?: AriaInputProps['type']
  inputMode?: AriaInputProps['inputMode']
  autoComplete: AriaInputProps['autoComplete']
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
    ...inputProps
  } = props

  return (
    <AriaTextField {...inputProps} className="grid gap-2">
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
            {createElement(icon, { size: 20, color: 'currentColor' })}
          </div>
        )}
        <AriaInput
          ref={ref}
          className={styles({ size, icon: Boolean(icon) })}
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
        />
      </div>
    </AriaTextField>
  )
}

const styles = cva({
  base: [
    'block h-10 w-full min-w-0 flex-1 border border-neutral-20 bg-white-100 text-15 text-neutral-100 placeholder-neutral-40',
    'outline-none focus:border-neutral-40',
    'disabled:border-neutral-20 disabled:opacity-[0.3]',
    'invalid:border-danger-/40',

    // dark
  ],
  variants: {
    size: {
      '40': 'h-10 rounded-6 px-4',
      '32': 'h-8 rounded-5 px-3',
    },
    icon: {
      true: '',
    },
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
  ],
})

const _Input = forwardRef(Input)

export { _Input as Input }
export type { Props as InputProps }
