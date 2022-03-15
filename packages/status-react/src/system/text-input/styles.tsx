import { styled } from '~/src/styles/config'

export const Base = styled('input', {
  fontFamily: '$sans',
  lineHeight: 1.2,
  fontSize: '15px',
  padding: '10px 16px',
  background: '#EEF2F5',
  borderRadius: 8,
  height: 44,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&::placeholder': {
    color: '#939BA1',
  },

  '&:focus': {
    boxShadow: `0 0 0 2px blue`,
  },
})
