import { TimeoutIcon } from '@status-im/icons/12'
import { Stack } from 'tamagui'

import { Button } from '../../button'
import { Text } from '../../text'

type Props = {
  timestamp: string
  text: string
  action?: {
    label: string
    onClick: () => void
  }
}

const DeletedMessageContent = (props: Props) => {
  const { timestamp, text, action } = props

  return (
    <Stack flexDirection="row" space={2} justifyContent="space-between">
      <Stack
        flexDirection="row"
        alignItems="center"
        justifyContent="space-between"
        minWidth={800}
      >
        <Stack flexDirection="row" space={8} alignItems="baseline">
          <Text size={13}>{text}</Text>
          <Text size={11} color="$neutral-50">
            {timestamp}
          </Text>
        </Stack>
        {action && (
          <Button
            onPress={action.onClick}
            variant="darkGrey"
            size={24}
            icon={<TimeoutIcon />}
          >
            {action.label}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}

export { DeletedMessageContent }
