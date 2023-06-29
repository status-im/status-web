import { IconButton, Text } from '@status-im/components'
import { DropdownMenu } from '@status-im/components/src/dropdown-menu'
import { SortIcon } from '@status-im/icons'

import type { Order_By } from '@/lib/graphql/generated/schemas'

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
    <div>
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
                  onOrderByValueChange(option.id)
                }}
                selected={orderByValue === option.id}
              />
            )
          })}
        </DropdownMenu.Content>
      </DropdownMenu>
    </div>
  )
}

export { DropdownSort }
export type { Props as DropdownSortProps }
