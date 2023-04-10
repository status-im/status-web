import { TimeoutIcon } from '@status-im/icons/12'
import { DeleteIcon } from '@status-im/icons/20'
import { Stack } from 'tamagui'

import { IconAvatar } from '../../avatar'
import { Button } from '../../button'
import { Text } from '../../text'

import type { SystemMessageState } from '../system-message'

type Props = {
  timestamp: string
  text: string
  action?: {
    label: string
    onClick: () => void
  }
  state: SystemMessageState
}

const DeletedMessageContent = (props: Props) => {
  const { timestamp, text, action, state } = props

  return (
    <>
      <IconAvatar
        backgroundColor={state === 'landed' ? '$transparent' : '$red-50-opa-5'}
        color="$neutral-100"
      >
        <DeleteIcon />
      </IconAvatar>
      <Stack
        flexDirection="row"
        space={2}
        justifyContent="space-between"
        flexBasis="max-content"
        flexGrow={1}
      >
        <Stack
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          flexGrow={1}
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
    </>
  )
}

export { DeletedMessageContent }
