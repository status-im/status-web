import React, { forwardRef } from 'react'

import { NavLink } from 'react-router-dom'

import { styled } from '../../../../styles/config'
import { Avatar } from '../../../../system'

import type { Ref } from 'react'

interface Props {
  to: string
  muted: boolean
  unread: boolean
  children: React.ReactNode
  name?: string
  color?: string
}

const SidebarItem = (props: Props, ref: Ref<HTMLAnchorElement>) => {
  const { muted, unread, children, name, color, ...buttonProps } = props

  return (
    <Link
      ref={ref}
      state={muted ? 'muted' : unread ? 'unread' : undefined}
      {...buttonProps}
    >
      <Avatar size={24} name={name} color={color} />
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
  color: '$accent-4',
  alignItems: 'center',
  width: '100%',
  gap: '$2',
  borderRadius: 8,
  padding: 8,

  '&:hover': {
    background: '$gray-3',
  },

  '&.active': {
    color: '$accent-1',
    background: '$gray-3',
  },

  variants: {
    state: {
      muted: {
        color: '$accent-5',
      },
      unread: {
        color: '$accent-1',
        fontWeight: '$600',
        // '&::after': {
        //   content: '"1"',
        //   textAlign: 'center',
        //   position: 'absolute',
        //   right: 8,
        //   width: 22,
        //   height: 22,
        //   background: '$primary-1',
        //   borderRadius: '$full',
        //   fontSize: 12,
        //   color: '$accent-11',
        // },
      },
    },
  },
})
