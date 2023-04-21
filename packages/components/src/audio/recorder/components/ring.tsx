import { useEffect, useMemo } from 'react'

import { Animated, StyleSheet } from 'react-native'

const SIZE = 56
const COLOR = '#2A799B'

type RingPropType = {
  index: number
}

const Ring = (props: RingPropType) => {
  const { index } = props

  const opacityValue = useMemo(() => new Animated.Value(0), [])
  const scaleValue = useMemo(() => new Animated.Value(1), [])

  useEffect(() => {
    const animation = Animated.loop(
      Animated.stagger(100, [
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(scaleValue, {
          toValue: 1.7,
          duration: 500,
          useNativeDriver: false,
        }),
      ])
    )

    animation.start()

    return () => animation.stop()
  }, [index, opacityValue, scaleValue])

  const rStyle = {
    transform: [
      {
        scale: scaleValue,
      },
    ],
    opacity: opacityValue.interpolate({
      inputRange: [0.3, 1],
      outputRange: [0.7, 0],
    }),
  }

  return <Animated.View style={[styles.dot, rStyle]} />
}

const styles = StyleSheet.create({
  dot: {
    height: SIZE,
    width: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: COLOR,
    position: 'absolute',
  },
})

export { Ring }
