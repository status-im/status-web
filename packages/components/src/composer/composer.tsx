import { YStack } from 'tamagui'

import { Input } from '../input'

const Composer = () => {
  return (
    <YStack
      backgroundColor="$background"
      shadowColor="rgba(9, 16, 28, 0.08)"
      shadowOffset={{ width: 0, height: -4 }}
      shadowRadius={20}
      borderTopLeftRadius={20}
      borderTopRightRadius={20}
      elevation={0}
      p={16}
      pt={8}
    >
      <YStack>
        <Input
          elevation={10}
          placeholder="Type something..."
          borderWidth={0}
          px={0}
        />
      </YStack>
    </YStack>
  )
}

// 0px -4px 20px

export { Composer }
