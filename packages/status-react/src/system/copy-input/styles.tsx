import { styled } from '../../styles/config'

export const Wrapper = styled('div', {
  position: 'relative',

  input: {
    paddingRight: 82,
    textOverflow: 'ellipsis',
  },
})

export const CopyButton = styled('button', {
  fontFamily: '$sans',
  position: 'absolute',
  right: 8,
  bottom: 8,
  fontSize: 12,
  lineHeight: 1.2,
  borderRadius: '$8',
  padding: '6px 12px',
  background: '$primary-3',
  color: '$primary-1',
  border: '1px solid $primary-1',

  '&:hover': {
    background: '$primary-2',
  },
})
