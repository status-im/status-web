import { memo, useEffect, useRef } from 'react'

import { AudioIcon, StopIcon } from '@status-im/icons'
import { Stack } from '@tamagui/core'
import { Animated, StyleSheet } from 'react-native'

const SIZE = 56
const COLOR = '#2A799B'
const BORDER_COLOR = '#2A799B'
const NUM_OF_RINGS = 5
const DURATION = 5000
const DELAY = 1000

type RingProps = {
  index: number
}

type Props = {
  onPress: () => void
  isRecording?: boolean
}

const CaptureButton = (props: Props) => {
  const { onPress, isRecording } = props

  return (
    <Stack
      animation="fast"
      style={styles.button}
      onPress={onPress}
      cursor="pointer"
      pressStyle={{
        scale: 0.9,
      }}
      hoverStyle={{
        opacity: 0.9,
      }}
    >
      {isRecording ? (
        <StopIcon size={20} color="$white-100" />
      ) : (
        <AudioIcon size={20} color="$white-100" />
      )}
      {isRecording &&
        [...Array(NUM_OF_RINGS)].map((_, index) => (
          <Ring key={index} index={index} />
        ))}
    </Stack>
  )
}

export { CaptureButton }

const RingBeforeMemoization = (props: RingProps) => {
  const { index } = props
  const scaleValue = new Animated.Value(1)
  const opacityValue = new Animated.Value(0.3)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const scaleAnimation = Animated.loop(
    Animated.parallel([
      Animated.timing(scaleValue, {
        toValue: 1.71,
        duration: DURATION,
        useNativeDriver: false,
      }),
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: DURATION,
        useNativeDriver: false,
      }),
    ])
  )

  useEffect(() => {
    timeoutRef.current = setTimeout(() => {
      scaleAnimation.start()
    }, index * DELAY)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      scaleAnimation.stop()
    }
  }, [index, scaleAnimation])

  return (
    <Animated.View
      key={index}
      style={[
        styles.ring,
        {
          transform: [
            {
              scale: scaleValue,
            },
          ],
          opacity: opacityValue,
          width: SIZE,
          height: SIZE,
          borderRadius: SIZE / 2,
          borderWidth: 1,
          borderColor: BORDER_COLOR,
          position: 'absolute',
        },
      ]}
    />
  )
}

// We need to memoize the component to avoid re-rendering
const Ring = memo(RingBeforeMemoization)

const styles = StyleSheet.create({
  button: {
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    borderRadius: SIZE / 2,
    borderWidth: 1,
    borderStyle: 'dotted',
  },
})
