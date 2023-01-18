import { Pressable } from 'react-native'
import { Stack, XStack, YStack } from 'tamagui'

interface Props {}

const ReactionButton = ({ type }) => {
  return (
    <Stack
      padding={3}
      borderWidth={1}
      borderColor="$neutral-100"
      borderRadius={2}
    >
      {type}
    </Stack>
  )
}

export const Reactions = (props: Props) => {
  const {} = props

  return (
    <XStack>
      <ReactionButton type="like" />
      <ReactionButton type="+1" />
      <ReactionButton type="-1" />
      <ReactionButton type="sad" />
      <ReactionButton type="angry" />
    </XStack>
  )
}
