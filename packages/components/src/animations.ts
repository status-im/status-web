import { createAnimations as createAnimationsCSS } from '@tamagui/animations-css'
import { createAnimations } from '@tamagui/animations-react-native'

export const animations = createAnimations({
  bouncy: {
    type: 'spring',
    damping: 10,
    mass: 0.9,
    stiffness: 100,
  },
  lazy: {
    type: 'spring',
    damping: 20,
    stiffness: 60,
  },
  quick: {
    type: 'spring',
    damping: 20,
    mass: 1.2,
    stiffness: 250,
  },
})

export const animationsCSS = createAnimationsCSS({
  fast: 'ease-in 150ms',
  medium: 'ease-in 300ms',
  slow: 'ease-in 450ms',
})
