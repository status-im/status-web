import React, { cloneElement } from 'react'

import { ChevronRightIcon } from '~/src/icons/chevron-right-icon'
import { styled, theme } from '~/src/styles/config'

import { Box } from '../box'
import { Icon } from '../icon'

const Content = styled('div', {
  minWidth: 176,
  padding: '8px 0',
  background: theme.colors.white,
  borderRadius: theme.radii[8],
  boxShadow:
    '0px 2px 4px rgba(0, 34, 51, 0.16), 0px 4px 12px rgba(0, 34, 51, 0.08)',
})

interface ItemProps {
  icon?: React.ReactElement
  children: React.ReactNode
  danger?: boolean
}

const Item = (props: ItemProps & { as: string | React.ComponentType }) => {
  const { icon, children, ...itemProps } = props

  return (
    <ItemBase {...itemProps}>
      {icon && (
        <Box css={{ width: 16, height: 16 }}>
          <Icon hidden>{cloneElement(icon, { width: 16, height: 16 })}</Icon>
        </Box>
      )}
      {children}
    </ItemBase>
  )
}

const ItemBase = styled('div', {
  all: 'unset',
  height: 34,
  fontSize: 13,
  lineHeight: 1,
  color: '#000',
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  padding: '4px 12px 4px 14px',
  position: 'relative',
  userSelect: 'none',
  whiteSpace: 'nowrap',

  '&:focus, &[aria-selected="true"], &[aria-expanded="true"]': {
    backgroundColor: '#EEF2F5',
  },

  '&[data-disabled]': {
    pointerEvents: 'none',
  },

  svg: {
    color: '#4360DF',
  },

  variants: {
    danger: {
      true: {
        color: '#FF2D55',
        svg: {
          color: '#FF2D55',
        },
      },
    },
  },
})

type TriggerItemProps = ItemProps

const TriggerItem = (
  props: ItemProps & { as: string | React.ComponentType }
) => {
  const { children, ...itemProps } = props

  return (
    <Item {...itemProps}>
      {children}
      <TriggerItemIcon>
        <ChevronRightIcon />
      </TriggerItemIcon>
    </Item>
  )
}

const TriggerItemIcon = styled('div', {
  marginLeft: 'auto',
  paddingLeft: 20,
})

const Separator = styled('div', {
  height: 1,
  background: '#F0F2F5',
  margin: '5px 0',
})

export { Content, Item, Separator, TriggerItem }
export type { ItemProps, TriggerItemProps }
