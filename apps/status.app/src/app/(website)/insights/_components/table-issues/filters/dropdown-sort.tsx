import { DropdownMenu, IconButton, Text } from '@status-im/components'
import { SortIcon } from '@status-im/icons/20'

import type { Order_By } from '~website/insights/_graphql/generated/schemas'

type Data = {
  id: Order_By
  name: string
}

type Props = {
  data: Data[]
  orderByValue: Order_By
  onOrderByValueChange: (value: Order_By) => void
}

const DropdownSort = (props: Props) => {
  const { data, orderByValue, onOrderByValueChange } = props

  return (
    <DropdownMenu.Root>
      <IconButton icon={<SortIcon />} variant="outline" />
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
                onOrderByValueChange(option.id)
              }}
              selected={orderByValue === option.id}
            />
          )
        })}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}

export { DropdownSort }
export type { Props as DropdownSortProps }
