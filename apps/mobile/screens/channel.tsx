// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable import/namespace */
import { Composer, Messages } from '@status-im/components'
import { Stack, useTheme } from '@tamagui/core'
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { ScrollView } from 'tamagui'

export const ChannelScreen = () => {
  const insets = useSafeAreaInsets()
  const theme = useTheme()

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.select({ ios: 60 })}
      style={{ height: '100%', flex: 1, backgroundColor: theme.background.val }}
    >
      <ScrollView paddingHorizontal={12} width="100%">
        <Messages py={20} />
      </ScrollView>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Stack pb={insets.bottom}>
          <Composer />
        </Stack>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
