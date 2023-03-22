import { XStack, YStack } from 'tamagui'

import { Author } from '../author/author'
import { Avatar } from '../avatar'
import { Text } from '../text'

import type { AuthorProps } from '../author/author'
import type { AvatarProps } from '../avatar'

type Props = {
  users: (Pick<AvatarProps, 'src' | 'indicator'> & AuthorProps)[]
}

const UserList = (props: Props) => {
  const { users } = props

  return (
    <YStack>
      {users.map((user, index) => {
        return (
          <XStack
            key={user.address! + index}
            padding={8}
            space={8}
            borderRadius={12}
            alignItems="center"
            cursor="pointer"
            hoverStyle={{
              backgroundColor: '$primary-50-opa-5',
            }}
          >
            <Avatar size={32} src={user.src} indicator={user.indicator} />
            <YStack>
              <Author
                name={user.name}
                nickname={user.nickname}
                status={user.status}
                orientation="vertical"
              />
              <Text size={13} color="$neutral-50">
                {user.address}
              </Text>
            </YStack>
          </XStack>
        )
      })}
    </YStack>
  )
}

export { UserList }
export type { Props as USerListProps }
