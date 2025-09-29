'use client'

import { Tag } from '@status-im/components'
import { AddIcon } from '@status-im/icons/12'
import { useController } from 'react-hook-form'

import { EpicTag } from '~admin/_components/epic-tag'
import { InsightsCombobox } from '~admin/_components/insights-combobox'

import type { ApiOutput } from '~server/api/types'

type Props = {
  name: string
  epics: ApiOutput['epics']['all']
}

const EpicPicker = (props: Props) => {
  const { name, epics } = props

  const { field, fieldState } = useController<Record<string, number[]>>({
    name,
  })

  const errorMessage = fieldState.error?.message

  return (
    <div className="flex flex-col gap-2">
      <p className="text-13 font-medium text-neutral-50">Epics</p>
      <div className="flex items-center">
        <div className="flex flex-wrap gap-1 pr-1">
          {field.value.map(epicId => {
            const epic = epics.find(e => e.id === epicId)!
            return (
              <EpicTag
                key={epic.id}
                label={epic.name}
                color={epic.color as `#${string}`}
                onRemove={() => {
                  field.onChange(field.value.filter(id => id !== epic.id))
                }}
              />
            )
          })}

          <div>
            <InsightsCombobox
              items={epics}
              selection={field.value}
              onSelectionChange={field.onChange}
            >
              <button type="button" className="group inline-flex">
                {field.value.length === 0 ? (
                  <div className="[&>div]:cursor-pointer">
                    <Tag size="24" label="Add epic" icon={<AddIcon />} />
                  </div>
                ) : (
                  <div className="w-6 [&>div]:cursor-pointer">
                    <Tag size="24" icon={<AddIcon />} />
                  </div>
                )}
              </button>
            </InsightsCombobox>
          </div>
        </div>
      </div>
      {errorMessage && (
        <p className="pt-1 text-15 text-danger-50">{errorMessage}</p>
      )}
    </div>
  )
}

export { EpicPicker }
