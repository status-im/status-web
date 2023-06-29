import { cloneElement, useMemo, useState } from 'react'

import { Avatar, Button, Input, Text } from '@status-im/components'
import { DropdownMenu } from '@status-im/components/src/dropdown-menu'
import { DropdownIcon, SearchIcon } from '@status-im/icons'
import Image from 'next/image'

import { useCurrentBreakpoint } from '@/hooks/use-current-breakpoint'

import { ColorCircle } from './components/color-circle'

import type { ColorTokens } from '@tamagui/core'

type Data = {
  id: string
  name: string
  avatar?: string | React.ReactElement
  color?: ColorTokens | `#${string}`
}

type Props = {
  data: Data[]
  label: string
  placeholder?: string
  selectedValues: string[]
  onSelectedValuesChange: (values: string[]) => void
}

const isAvatar = (value: unknown): value is string => {
  return typeof value === 'string' && value !== null
}

const RenderIcon = (props: Data) => {
  if (props.color) {
    return <ColorCircle color={props.color} />
  }

  if (!props.avatar) {
    return <></>
  }

  if (isAvatar(props.avatar)) {
    return <Avatar src={props.avatar} size={16} name={props.name} type="user" />
  }

  return cloneElement(props.avatar) || <></>
}

const DropdownFilter = (props: Props) => {
  const { data, label, placeholder, selectedValues, onSelectedValuesChange } =
    props

  const [filterText, setFilterText] = useState('')

  const filteredData = useMemo(
    () =>
      data.filter(label =>
        label.name.toLowerCase().includes(filterText.toLowerCase())
      ),
    [data, filterText]
  )

  const [isOpen, setIsOpen] = useState(false)

  const currentBreakpoint = useCurrentBreakpoint()

  return (
    <div>
      <DropdownMenu onOpenChange={() => setIsOpen(!isOpen)} modal={false}>
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

        <DropdownMenu.Content
          sideOffset={10}
          align={currentBreakpoint === '2xl' ? 'end' : 'start'}
        >
          <div className="p-2 px-1">
            <Input
              placeholder={placeholder || 'Search'}
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
                icon={<RenderIcon {...filtered} />}
                label={filtered.name}
                checked={selectedValues.includes(filtered.id)}
                onSelect={() => {
                  if (selectedValues.includes(filtered.id)) {
                    onSelectedValuesChange(
                      selectedValues.filter(id => id !== filtered.id)
                    )
                  } else {
                    onSelectedValuesChange([...selectedValues, filtered.id])
                  }
                }}
              />
            )
          })}
          {filteredData.length === 0 && (
            <div className="flex flex-col items-center justify-center p-2 py-1">
              <Image
                className="pb-3 invert"
                alt="No results"
                src={'/assets/filters/empty.png'}
                width={80}
                height={80}
              />
              <div className="pb-[2px]">
                <Text size={15} weight="semibold">
                  No options found
                </Text>
              </div>
              <div className="text-center">
                <Text size={13}>
                  We didn&apos;t find results that match your search
                </Text>
              </div>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}

export { DropdownFilter }
export type { Props as DropdownFilterProps }
