import React, { useMemo } from 'react'

import styled from 'styled-components'

import { useUserPublicKey } from '../../contexts/identityProvider'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { buttonStyles } from '../Buttons/buttonStyle'
import { LogoutIcon } from '../Icons/LogoutIcon'
import { LogoutModalName } from '../Modals/LogoutModal'
import { Member } from './Member'

import type { Contact } from '../../models/Contact'

export function MembersList() {
  const { contacts, nickname, activeChannel } = useMessengerContext()
  const userPK = useUserPublicKey()
  const { setModal } = useModal(LogoutModalName)

  const members = useMemo(() => {
    const contactsArray = Object.values(contacts)
    if (userPK) {
      if (
        activeChannel &&
        activeChannel.type === 'group' &&
        activeChannel.members
      ) {
        const returnContacts: Contact[] = []
        activeChannel.members.forEach(member => {
          if (contacts[member.id] && member.id != userPK) {
            returnContacts.push(contacts[member.id])
          }
        })
        return returnContacts
      }
      return contactsArray.filter(e => e.id !== userPK)
    }
    return contactsArray
  }, [activeChannel, contacts, userPK])

  const onlineContacts = useMemo(() => members.filter(e => e.online), [members])
  const offlineContacts = useMemo(
    () => members.filter(e => !e.online),
    [members]
  )

  return (
    <MembersListWrap>
      {userPK && (
        <MemberCategory>
          <MemberCategoryName>You</MemberCategoryName>
          <Row>
            <Member
              contact={{
                id: userPK,
                customName: nickname,
                trueName: userPK,
              }}
              isYou={true}
            />
            <LogoutBtn onClick={() => setModal(true)}>
              <LogoutIcon />
            </LogoutBtn>
          </Row>
        </MemberCategory>
      )}
      {onlineContacts.length > 0 && (
        <MemberCategory>
          <MemberCategoryName>Online</MemberCategoryName>
          {onlineContacts.map(contact => (
            <Member
              key={contact.id}
              contact={contact}
              isOnline={contact.online}
            />
          ))}
        </MemberCategory>
      )}
      {offlineContacts.length > 0 && (
        <MemberCategory>
          <MemberCategoryName>Offline</MemberCategoryName>
          {offlineContacts.map(contact => (
            <Member
              key={contact.id}
              contact={contact}
              isOnline={contact.online}
            />
          ))}
        </MemberCategory>
      )}
    </MembersListWrap>
  )
}

const MembersListWrap = styled.div`
  display: flex;
  flex-direction: column;

  &::-webkit-scrollbar {
    width: 0;
  }
`

const MemberCategory = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 16px;
`

const MemberCategoryName = styled.h3`
  font-weight: normal;
  font-size: 13px;
  line-height: 18px;
  color: ${({ theme }) => theme.secondary};
  margin-bottom: 8px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const LogoutBtn = styled.button`
  ${buttonStyles}
  width: 32px;
  height: 32px;
  border-radius: 50%;
  padding: 0;
`
