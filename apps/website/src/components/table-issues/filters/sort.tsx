import { useState } from 'react'

import { IconButton, Text } from '@status-im/components'
import { DropdownMenu } from '@status-im/components/src/dropdown-menu'
import { SortIcon } from '@status-im/icons'

type Data = {
  id: number
  name: string
}

type Props = {
  data: Data[]

  noPadding?: boolean
}

const Sort = (props: Props) => {
  const { data, noPadding } = props

  const [selectedValue, setSelectedValue] = useState<number>()

  return (
    <div className={noPadding ? '' : 'pr-2'}>
      <DropdownMenu>
        <div className="relative">
          <IconButton icon={<SortIcon size={20} />} variant="outline" />
        </div>
        <DropdownMenu.Content sideOffset={10} align="end">
          <div className="p-2">
            <Text size={13} color="$neutral-80">
              Sort by
            </Text>
          </div>
          {data.map(option => {
            return (
              <DropdownMenu.Item
                key={option.id}
                label={option.name}
                onSelect={() => {
                  setSelectedValue(option.id)
                }}
                selected={selectedValue === option.id}
              />
            )
          })}
          {data.length === 0 && (
            <div className="flex flex-col items-center justify-center p-2 py-1">
              <img
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
                <Text size={13}>We didn&apos;t find any results</Text>
              </div>
            </div>
          )}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}

export { Sort }
export type { Props as SortProps }
