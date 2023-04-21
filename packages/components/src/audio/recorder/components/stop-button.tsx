import { StopIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import { StyleSheet, View } from 'react-native'

import { Ring } from './ring'

const COLOR = '#2A799B'
const SIZE = 56

const StopButton = () => {
  return (
    <View style={styles.container}>
      <View style={[styles.dot, styles.center]}>
        <Stack zIndex="$2">
          <StopIcon size={20} color="$white-100" />
        </Stack>
        {[...Array(5).keys()].map((_, index) => (
          <Ring key={index} index={index} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLOR,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export { StopButton }
