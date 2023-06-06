import { useState } from 'react'

import { Avatar, Button, Input, Text } from '@status-im/components'
import { DropdownMenu } from '@status-im/components/src/dropdown-menu'
import { DropdownIcon, SearchIcon } from '@status-im/icons'

import { ColorCircle } from './components/color-circle'

import type { ColorTokens } from '@tamagui/core'

type Props = {
  data: {
    id: number
    name: string
    avatar?: string
    color?: ColorTokens | `#${string}`
  }[]
  label: string
  noResultsText?: string
  noPadding?: boolean
}
const FilterWithCheckboxes = (props: Props) => {
  const { data, label, noResultsText, noPadding } = props

  const [filterText, setFilterText] = useState('')

  // TODO - this will be improved by having a debounced search and use memoization
  const filteredData = data.filter(label =>
    label.name.toLowerCase().includes(filterText.toLowerCase())
  )

  const [selectedValues, setSelectedValues] = useState<number[]>([])
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className={noPadding ? '' : 'pr-3'}>
      <DropdownMenu onOpenChange={() => setIsOpen(!isOpen)}>
        <Button
          size={32}
          variant="outline"
          iconAfter={
            <div
              className={`transition-transform ${
                isOpen ? 'rotate-180' : 'rotate-0'
              }`}
            >
              <DropdownIcon size={20} />
            </div>
          }
        >
          {label}
        </Button>
        <DropdownMenu.Content sideOffset={10} align="end">
          <div className="p-2 px-1">
            <Input
              placeholder="Find epics"
              icon={<SearchIcon size={20} />}
              size={32}
              value={filterText}
              onChangeText={setFilterText}
            />
          </div>
          {filteredData.map(filtered => {
            return (
              <DropdownMenu.CheckboxItem
                key={filtered.id}
                icon={
                  filtered.color ? (
                    <ColorCircle color={filtered.color} />
                  ) : (
                    <Avatar
                      name={filtered.name}
                      src={filtered.avatar}
                      size={16}
                      type="user"
                    />
                  )
                }
                label={filtered.name}
                checked={selectedValues.includes(filtered.id)}
                onSelect={() => {
                  if (selectedValues.includes(filtered.id)) {
                    setSelectedValues(
                      selectedValues.filter(id => id !== filtered.id)
                    )
                  } else {
                    setSelectedValues([...selectedValues, filtered.id])
                  }
                }}
              />
            )
          })}
          {filteredData.length === 0 && (
            <div className="p-2 py-1">
              <Text size={13}>{noResultsText}</Text>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}

export { FilterWithCheckboxes }
export type { Props as FilterWithCheckboxesProps }
