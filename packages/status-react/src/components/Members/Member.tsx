import React, { useRef, useState } from 'react'

import styled from 'styled-components'

import { useIdentity } from '../../contexts/identityProvider'
import { useClickOutside } from '../../hooks/useClickOutside'
import { ContactMenu } from '../Form/ContactMenu'
import { IconBtn, UserAddress } from '../Messages/Styles'
import { UserLogo } from './UserLogo'

import type { Contact } from '../../models/Contact'

interface MemberProps {
  contact: Contact
  isOnline?: boolean
  isYou?: boolean
  onClick?: () => void
}

export function Member({ contact, isOnline, isYou, onClick }: MemberProps) {
  const identity = useIdentity()

  const [showMenu, setShowMenu] = useState(false)

  const ref = useRef(null)
  useClickOutside(ref, () => setShowMenu(false))

  return (
    <MemberData onClick={onClick} className={`${isYou && 'you'}`}>
      <MemberIcon
        style={{
          backgroundImage: 'unset',
        }}
        className={
          !isYou && isOnline ? 'online' : !isYou && !isOnline ? 'offline' : ''
        }
        onClick={() => {
          if (identity) setShowMenu(e => !e)
        }}
        ref={ref}
      >
        {showMenu && <ContactMenu id={contact.id} setShowMenu={setShowMenu} />}
        <UserLogo
          contact={contact}
          radius={30}
          colorWheel={[
            ['red', 150],
            ['blue', 250],
            ['green', 360],
          ]}
        />
      </MemberIcon>
      <Column>
        <MemberName>{contact?.customName ?? contact.trueName}</MemberName>
        <UserAddress>
          {contact.id.slice(0, 5)}...{contact.id.slice(-3)}
        </UserAddress>
      </Column>
    </MemberData>
  )
}

export const MemberData = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  cursor: pointer;

  &.you {
    margin-bottom: 0;
    cursor: default;
  }
`

export const MemberName = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  opacity: 0.7;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`

export const MemberIcon = styled(IconBtn)`
  width: 29px;
  height: 29px;

  &.offline {
    &::after {
      content: '';
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.secondary};
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }

  &.online {
    &::after {
      content: '';
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #4ebc60;
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`
