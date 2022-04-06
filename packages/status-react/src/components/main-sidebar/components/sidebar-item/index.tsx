import React, { forwardRef } from 'react'

import { NavLink } from 'react-router-dom'

import { styled } from '~/src/styles/config'
import { Avatar } from '~/src/system'

import type { Ref } from 'react'

interface Props {
  to: string
  muted: boolean
  unread: boolean
  children: React.ReactNode
}

const SidebarItem = (props: Props, ref: Ref<HTMLAnchorElement>) => {
  const { muted, unread, children, ...buttonProps } = props

  return (
    <Link
      ref={ref}
      state={muted ? 'muted' : unread ? 'unread' : undefined}
      {...buttonProps}
    >
      <Avatar size={24} />
      {children}
    </Link>
  )
}

const _SidebarItem = forwardRef(SidebarItem)

export { _SidebarItem as SidebarItem }
export type SidebarItemProps = Omit<Props, 'children'>

const Link = styled(NavLink, {
  position: 'relative',
  fontFamily: '$sans',
  fontWeight: '$500',
  fontSize: 15,
  display: 'inline-flex',
  color: 'rgba(0, 0, 0, 0.7)',
  alignItems: 'center',
  width: '100%',
  gap: '$2',
  borderRadius: 8,
  padding: 8,

  '&:hover': {
    background: '#E9EDF1',
  },

  '&.active': {
    background: 'rgba(233, 237, 241, 1)',
  },

  variants: {
    state: {
      muted: {
        color: 'rgba(0, 0, 0, 0.4)',
      },
      unread: {
        fontWeight: '$600',
        '&::after': {
          content: '"1"',
          textAlign: 'center',
          position: 'absolute',
          right: 8,
          width: 22,
          height: 22,
          background: '#4360DF',
          borderRadius: '$full',
          fontSize: 12,
          color: '#fff',
        },
      },
    },
  },
})
