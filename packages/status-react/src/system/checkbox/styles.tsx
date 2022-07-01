import * as Checkbox from '@radix-ui/react-checkbox'
import { Label } from '@radix-ui/react-label'

import { styled, theme } from '../../styles/config'

export const Wrapper = styled(Label, {
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: 10,
})

export const Root = styled(Checkbox.Root, {
  height: 18,
  width: 18,
  flexShrink: 0,
  borderRadius: theme.radii['1'],
  background: theme.colors['accent-8'],

  '&:hover': {},

  '&[aria-checked="true"]': {
    background: theme.colors['primary-1'],
    color: theme.colors.white,
    '&:hover': {},
  },
})

export const Indicator = styled(Checkbox.Indicator, {
  width: '100%',
  height: '100%',
})
