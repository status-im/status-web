import { ChevronRightIcon } from '@status-im/icons/20'
import { Stack } from '@tamagui/core'

import { Counter } from '../../counter'
import { Text } from '../../text'
import { DividerLine } from '../divider-line'

import type { CounterProps } from '../../counter'

type Props = {
  label: string
  tight?: boolean
  count?: CounterProps['value']
  counterType?: CounterProps['type']
} & (
  | {
      type?: 'default'
    }
  | {
      type?: 'expandable'
      expanded: boolean
      // ?chevronPosition?: 'left' | 'right'
    }
)

const DividerLabel = (props: Props) => {
  const { label, tight = true, counterType = 'secondary', count } = props

  return (
    <Stack paddingBottom={8} gap={tight ? 8 : 16}>
      <DividerLine />
      <Stack
        paddingHorizontal={16}
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
      >
        <Stack flexDirection="row" alignItems="center" gap={2}>
          {props.type === 'expandable' && (
            <Stack
              marginLeft={-2}
              transform={[
                {
                  rotate: props.expanded ? '90deg' : '0deg',
                },
              ]}
            >
              <ChevronRightIcon color="$neutral-50" />
            </Stack>
          )}
          <Text size={13} color="$neutral-50" weight="medium">
            {label}
          </Text>
        </Stack>
        {count && count > 0 && <Counter type={counterType} value={count} />}
      </Stack>
    </Stack>
  )
}

export { DividerLabel }
export type { Props as DividerLabelProps }
