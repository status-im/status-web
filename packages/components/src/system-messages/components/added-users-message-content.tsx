import { Stack } from 'tamagui'

import { Avatar } from '../../avatar'
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
        <Avatar size={16} src={actor.src} />
        <Text size={13} weight="semibold">
          {actor.name}
        </Text>
        <Text size={13}>added </Text>
        {users.length === 1 && (
          <>
            <Avatar size={16} src={users[0].src} />
            <Text size={13} weight="semibold">
              {users[0].name}
            </Text>
          </>
        )}
        {users.length > 1 && (
          <Stack flexDirection="row" gap={4}>
            {users.map((user, i) => {
              return (
                <>
                  {users.length === i + 1 ? <Text size={13}> and </Text> : null}
                  <Avatar size={16} src={user.src} />
                  <Text size={13} weight="semibold">
                    {user.name}
                  </Text>
                </>
              )
            })}
          </Stack>
        )}
        <Text size={11} color="$neutral-50">
          {timestamp}
        </Text>
      </Stack>
    </Stack>
  )
}

export { AddedUsersContentMessage }
