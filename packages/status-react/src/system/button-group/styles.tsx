import { Item, Root } from '@radix-ui/react-toggle-group'

import { styled } from '../../styles/config'

export const Group = styled(Root, {
  backgroundColor: '$primary-3',
  borderRadius: '$2',
  height: 36,
  display: 'inline-flex',
  alignItems: 'stretch',
})

export const Button = styled(Item, {
  backgroundColor: '$transparent',
  color: '$primary-1',
  display: 'inline-flex',
  fontSize: 15,
  lineHeight: 1.2,
  fontWeight: '$500',
  padding: '8px 36px',
  alignItems: 'center',
  justifyContent: 'center',
  marginLeft: 1,

  '&:first-child': {
    marginLeft: 0,
    borderTopLeftRadius: '$2',
    borderBottomLeftRadius: '$2',
  },

  '&:last-child': {
    borderTopRightRadius: '$2',
    borderBottomRightRadius: '$2',
  },

  '&[data-state=on]': {
    backgroundColor: '$primary-1',
    color: '$white',
    borderRadius: '$2',
  },
})
