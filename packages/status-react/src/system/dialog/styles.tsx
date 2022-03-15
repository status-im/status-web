import { keyframes, styled } from '~/src/styles/config'

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
  backgroundColor: 'rgba(0,0,0,0.4)',

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
  backgroundColor: 'white',
  borderRadius: 8,
  boxShadow:
    'hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '638px',
  maxHeight: '85vh',

  '@motion': {
    animation: `${contentAnimation} 150ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
  },
})

export const Header = styled('div', {
  padding: '16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  borderBottom: '1px solid #eee',
})

export const Body = styled('div', {
  padding: '16px',
})

export const Actions = styled('div', {
  padding: '16px 18px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: 16,
  borderTop: '1px solid #eee',
})

export const Title = styled('div', {
  margin: 0,
  fontWeight: 500,
  fontSize: 17,
})
