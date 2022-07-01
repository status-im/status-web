import { keyframes, styled } from '../../styles/config'
import { Flex } from '../flex'

import type { VariantProps } from '../../styles/config'

export type Variants = VariantProps<typeof Content>

const overlayAnimation = keyframes({
  '0%': {
    opacity: 0,
  },
  '100%': {
    opacity: 1,
  },
})

export const Overlay = styled('div', {
  inset: 0,
  position: 'fixed',
  backgroundColor: '$overlay',

  '@motion': {
    animation: `${overlayAnimation} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

const contentAnimation = keyframes({
  '0%': {
    opacity: 0,
    transform: 'translate(-50%, -48%) scale(.96)',
  },
  '100%': {
    opacity: 1,
    transform: 'translate(-50%, -50%) scale(1)',
  },
})

export const Content = styled('div', {
  backgroundColor: '$background',
  borderRadius: 8,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxHeight: '85vh',

  '@motion': {
    animation: `${contentAnimation} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },

  variants: {
    size: {
      480: {
        maxWidth: '480px',
      },
      640: {
        maxWidth: '640px',
      },
      1060: {
        maxWidth: '1060px',
      },
    },
  },
  defaultVariants: {
    size: '480',
  },
})

export const Header = styled('div', {
  padding: '12px 12px 12px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid $gray-2',
})

export const Body = styled(Flex, {
  padding: '16px',

  defaultVariants: {
    direction: 'column',
  },
})

export const Actions = styled('div', {
  padding: '16px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  borderTop: '1px solid $gray-2',
  gap: 16,
})
