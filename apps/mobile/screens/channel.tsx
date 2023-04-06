import { useRef } from 'react'

import { Composer, Messages } from '@status-im/components'
import { Stack, useTheme } from '@tamagui/core'
import { StatusBar } from 'expo-status-bar'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'tamagui'

import type { RootStackParamList } from '../App'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

type ChannelScreenProps = NativeStackScreenProps<RootStackParamList, 'Channel'>

export const ChannelScreen = ({ route }: ChannelScreenProps) => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  // We need to get the channel name from the route params
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _channelName = route.params.channelId
  const scrollRef = useRef(null)

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ height: '100%', flex: 1, backgroundColor: theme.background.val }}
    >
      <StatusBar style={'dark'} animated />
      <ScrollView
        ref={scrollRef}
        paddingHorizontal={12}
        width="100%"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd()}
      >
        <Stack pt={insets.top + 60} pb={insets.bottom}>
          <Messages />
        </Stack>
      </ScrollView>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Stack>
          <Composer />
        </Stack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
