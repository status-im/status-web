'use client'

import { SelectInput, useField } from '@payloadcms/ui'
import { useMemo } from 'react'

import { IANA_TIME_ZONE_OPTIONS } from '@/lib/timezones'
import type { IanaTimeZone } from '@/types/timezones'

interface TimezoneFieldProps {
  field: {
    admin?: {
      description?: string
      isClearable?: boolean
      placeholder?: string
    }
    label?: string
    name: string
    required?: boolean
  }
  path: string
  readOnly?: boolean
}

const getSelectedValue = (selectedOption: unknown): IanaTimeZone | null => {
  if (
    typeof selectedOption === 'object' &&
    selectedOption !== null &&
    'value' in selectedOption &&
    typeof selectedOption.value === 'string'
  ) {
    return selectedOption.value
  }

  return null
}

export function TimezoneField({
  field,
  path: pathFromProps,
  readOnly,
}: TimezoneFieldProps) {
  const {
    customComponents: {
      AfterInput,
      BeforeInput,
      Description,
      Error,
      Label,
    } = {},
    disabled,
    path,
    setValue,
    showError,
    value,
  } = useField<string>({
    potentiallyStalePath: pathFromProps,
  })

  const optionByValue = useMemo(
    () => new Set(IANA_TIME_ZONE_OPTIONS.map((option) => option.value)),
    []
  )

  return (
    <>
      <SelectInput
        AfterInput={AfterInput}
        BeforeInput={BeforeInput}
        className="timezone-field"
        Description={Description}
        description={field.admin?.description}
        Error={Error}
        filterOption={({ label, value: optionValue }, search) =>
          optionByValue.has(optionValue) &&
          label.toLowerCase().includes(search.toLowerCase())
        }
        isClearable={field.admin?.isClearable ?? false}
        Label={Label}
        label={field.label}
        name={field.name}
        onChange={(selectedOption) => {
          setValue(getSelectedValue(selectedOption))
        }}
        options={IANA_TIME_ZONE_OPTIONS}
        path={path}
        placeholder={field.admin?.placeholder ?? 'Select a timezone'}
        readOnly={readOnly || disabled}
        required={field.required}
        showError={showError}
        style={{ minWidth: 0, width: '100%' }}
        value={typeof value === 'string' ? value : undefined}
      />
      <style jsx global>{`
        .timezone-field .react-select,
        .timezone-field .rs__control,
        .timezone-field .rs__menu {
          min-width: 0;
          width: 100%;
        }

        .timezone-field .rs__menu {
          min-width: 100%;
        }
      `}</style>
    </>
  )
}
