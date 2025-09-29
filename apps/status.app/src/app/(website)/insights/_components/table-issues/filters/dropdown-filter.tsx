import { useMemo, useState } from 'react'

import { DropdownButton, DropdownMenu, Text } from '@status-im/components'
import Image from 'next/image'

import { useMediaQuery } from '~hooks/use-media-query'

// import { ColorCircle } from './components/color-circle'

type Data = {
  id: string
  name: string
  avatar?: string | React.ReactElement
  color?: `#${string}`
}

type Props = {
  data: Data[]
  label: string
  placeholder?: string
  selectedValues: string[]
  onSelectedValuesChange: (values: string[]) => void
}

// const isAvatar = (value: unknown): value is string => {
//   return typeof value === 'string' && value !== null
// }

// const RenderIcon = (props: Data) => {
//   if (props.color) {
//     return <ColorCircle color={props.color} />
//   }

//   if (!props.avatar) {
//     return <></>
//   }

//   if (isAvatar(props.avatar)) {
//     return <Avatar type="user" size="16" name={props.name} src={props.avatar} />
//   }

//   return cloneElement(props.avatar) || <></>
// }

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

  const matches2XL = useMediaQuery('2xl')

  return (
    <DropdownMenu.Root onOpenChange={() => setIsOpen(!isOpen)} modal={false}>
      <DropdownButton size="32" variant="outline">
        {label}
      </DropdownButton>

      <DropdownMenu.Content
        sideOffset={10}
        align={matches2XL ? 'end' : 'start'}
      >
        <DropdownMenu.Search
          placeholder={placeholder || 'Search'}
          value={filterText}
          onChange={setFilterText}
        />

        <div className="max-h-96 overflow-y-auto">
          {filteredData.map(item => {
            return (
              <DropdownMenu.CheckboxItem
                key={item.id}
                // icon={<RenderIcon {...item} />}
                label={item.name}
                checked={selectedValues.includes(item.id)}
                onCheckedChange={() => {
                  if (selectedValues.includes(item.id)) {
                    onSelectedValuesChange(
                      selectedValues.filter(id => id !== item.id)
                    )
                  } else {
                    onSelectedValuesChange([...selectedValues, item.id])
                  }
                }}
                onSelect={e => e.preventDefault()}
              />
            )
          })}
        </div>
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
                We didn’t find results that match your search
              </Text>
            </div>
          </div>
        )}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { DropdownFilter }
