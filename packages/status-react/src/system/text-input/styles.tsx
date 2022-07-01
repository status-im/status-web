import { styled } from '../../styles/config'

export const Base = styled('input', {
  fontFamily: '$sans',
  lineHeight: 1.2,
  fontSize: '15px',
  padding: '10px 16px',
  background: '$gray-2',
  borderRadius: 8,
  height: 44,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',

  '&::placeholder': {
    color: '$gray-1',
  },

  '&:focus': {
    boxShadow: `0 0 0 2px blue`,
  },
})
