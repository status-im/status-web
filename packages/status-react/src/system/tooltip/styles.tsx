import * as Primitive from '@radix-ui/react-tooltip'

import { keyframes, styled, theme } from '../../styles/config'

export const slideUpAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

export const slideRightAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(-2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
})

export const slideDownAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateY(-2px)' },
  '100%': { opacity: 1, transform: 'translateY(0)' },
})

export const slideLeftAndFade = keyframes({
  '0%': { opacity: 0, transform: 'translateX(2px)' },
  '100%': { opacity: 1, transform: 'translateX(0)' },
})

export const Content = styled(Primitive.Content, {
  fontFamily: theme.fonts.sans,
  fontWeight: '$500',
  fontSize: 13,
  padding: 8,
  lineHeight: '18px',
  backgroundColor: '$accent-1',
  color: '$accent-11',
  borderRadius: 8,

  '@media (prefers-reduced-motion: no-preference)': {
    animationDuration: '400ms',
    animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
    animationFillMode: 'forwards',
    willChange: 'transform, opacity',

    '&[data-state="delayed-open"]': {
      '&[data-side="top"]': {
        animationName: slideDownAndFade,
      },

      '&[data-side="right"]': {
        animationName: slideLeftAndFade,
      },

      '&[data-side="bottom"]': {
        animationName: slideUpAndFade,
      },

      '&[data-side="left"]': {
        animationName: slideRightAndFade,
      },
    },
  },
})

export const Arrow = styled(Primitive.Arrow, {
  fill: '$accent-1',
})
