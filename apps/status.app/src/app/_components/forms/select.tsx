'use client'

import { useMemo } from 'react'

import { Listbox } from '@headlessui/react'
import { Tag } from '@status-im/components'
import { DropdownIcon } from '@status-im/icons/20'
import { cx } from 'class-variance-authority'
import { useController } from 'react-hook-form'

import { Field } from './field'

type SelectOption = {
  label: string
  value: string
  icon?: React.ReactNode
}

type Props = {
  label: string
  name: string
  options: Array<SelectOption>
  required?: boolean
  multiple?: boolean
}

const Select = (props: Props) => {
  const { label, name, options, required = false, multiple = false } = props

  const { field, fieldState } = useController({
    name,
    rules: { required: required ? 'This field is required' : false },
  })

  const error = fieldState.error
  const empty = field.value === '' || field.value.length === 0

  const active = useMemo(() => {
    if (field.value === '' || field.value.length === 0) {
      return 'Select an option'
    }

    if (multiple) {
      return (
        <div className="flex gap-1">
          {options
            .filter(option => field.value.includes(option.value))
            .map(option => (
              <Tag key={option.value} size="24" label={option.label} />
            ))}
        </div>
      )
    }

    // Check if option has an icon
    const option = options.find(option => option.value === field.value)
    return (
      <span className="-ml-1 flex items-center justify-start gap-2">
        {option?.icon}
        {option?.label}
      </span>
    )
  }, [field.value, options, multiple])

  return (
    <Field label={label} error={fieldState.error?.message}>
      <Listbox {...field} multiple={multiple}>
        <div className="relative z-50">
          <Listbox.Button
            className={cx(
              'group flex min-h-[32px] w-full flex-row items-center justify-between rounded-12 border border-solid py-2 align-middle text-15',
              multiple && !empty ? 'pl-2 pr-4' : 'px-4',
              empty ? 'text-neutral-40' : 'text-neutral-100',
              error ? 'border-danger-50' : 'border-neutral-30',
              'aria-expanded:border-neutral-40 focus:border-neutral-40'
            )}
          >
            {active}
            <DropdownIcon className="group-aria-expanded:rotate-180" />
          </Listbox.Button>

          <Listbox.Options
            // className="bg-white text-base shadow-lg ring-black/5 sm:text-sm absolute mt-1 max-h-60 w-full overflow-auto rounded-6 py-1 ring-1 focus:outline-none"
            className="absolute top-12 max-h-40 w-full overflow-auto rounded-12 border border-solid border-neutral-10 bg-white-100 p-1 shadow-3"
          >
            {options.map(option => (
              <Listbox.Option
                key={option.value}
                value={option.value}
                className={({ active, selected }) =>
                  cx(
                    'flex cursor-pointer items-center gap-2 rounded-10 bg-white-100 px-2 py-[5px] text-15 hover:bg-neutral-5',
                    active && 'bg-neutral-20',
                    selected && 'font-semibold'
                  )
                }
              >
                {option?.icon}
                {option.label}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </div>
      </Listbox>
    </Field>
  )
}

export { Select }
export type { Props as SelectProps }
