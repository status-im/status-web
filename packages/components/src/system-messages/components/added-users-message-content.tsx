import { Stack } from 'tamagui'

import { Text } from '../../text'

import type { User } from '../system-message'

type Props = {
  timestamp: string
  actor: User
  users: Array<User>
}

const AddedUsersContentMessage = (props: Props) => {
  const { actor, users, timestamp } = props

  return (
    <Stack flexDirection="row" space={2}>
      <Stack flexDirection="row" space={4} alignItems="center">
        <Text size={13} weight="semibold">
          {actor.name}
        </Text>
        <Text size={13}>added</Text>
        <Text size={13}>{users?.map(user => user.name)}</Text>
        <Text size={11} color="$neutral-50">
          {timestamp}
        </Text>
      </Stack>
    </Stack>
  )
}

export { AddedUsersContentMessage }
