import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useUserPublicKey } from '../../contexts/identityProvider'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { useModal } from '../../contexts/modalProvider'
import { AddContactIcon } from '../Icons/AddContactIcon'
import { BlockSvg } from '../Icons/BlockIcon'
import { ChatSvg } from '../Icons/ChatIcon'
import { EditIcon } from '../Icons/EditIcon'
import { ProfileIcon } from '../Icons/ProfileIcon'
import { UntrustworthIcon } from '../Icons/UntrustworthIcon'
import { UserIcon } from '../Icons/UserIcon'
import { WarningSvg } from '../Icons/WarningIcon'
import { UserAddress } from '../Messages/Styles'
import { ProfileModalName } from '../Modals/ProfileModal'
import { textMediumStyles } from '../Text'

import { DropdownMenu, MenuItem, MenuText } from './DropdownMenu'

type ContactMenuProps = {
  id: string
  setShowMenu: (val: boolean) => void
}

export function ContactMenu({ id, setShowMenu }: ContactMenuProps) {
  const userPK = useUserPublicKey()
  const { contacts, contactsDispatch } = useMessengerContext()
  const contact = useMemo(() => contacts[id], [id, contacts])
  const isUser = useMemo(() => {
    if (userPK) {
      return id === userPK
    } else {
      return false
    }
  }, [id, userPK])

  const { setModal } = useModal(ProfileModalName)

  if (!contact) return null
  return (
    <ContactDropdown>
      <ContactInfo>
        <UserIcon />
        <UserNameWrapper>
          <UserName>{contact?.customName ?? contact.trueName}</UserName>
          {contact.isUntrustworthy && <UntrustworthIcon />}
        </UserNameWrapper>
        {contact?.customName && (
          <UserTrueName>({contact.trueName})</UserTrueName>
        )}
        <UserAddress>
          {id.slice(0, 10)}...{id.slice(-3)}
        </UserAddress>
      </ContactInfo>
      <MenuSection>
        <MenuItem
          onClick={() => {
            setModal({ id, renamingState: false, requestState: false })
          }}
        >
          <ProfileIcon width={16} height={16} />
          <MenuText>View Profile</MenuText>
        </MenuItem>
        {!contact.isFriend && (
          <MenuItem
            onClick={() => {
              setModal({ id, requestState: true })
            }}
          >
            <AddContactIcon width={16} height={16} />
            <MenuText>Send Contact Request</MenuText>
          </MenuItem>
        )}
        {contact.isFriend && (
          <MenuItem>
            <ChatSvg width={16} height={16} />
            <MenuText>Send Message</MenuText>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            setModal({ id, renamingState: true })
          }}
        >
          <EditIcon width={16} height={16} />
          <MenuText>Rename</MenuText>
        </MenuItem>
      </MenuSection>
      <MenuSection>
        <MenuItem
          onClick={() =>
            contactsDispatch({ type: 'toggleTrustworthy', payload: { id } })
          }
        >
          <WarningSvg
            width={16}
            height={16}
            className={contact.isUntrustworthy ? '' : 'red'}
          />
          <MenuText className={contact.isUntrustworthy ? '' : 'red'}>
            {contact.isUntrustworthy
              ? 'Remove Untrustworthy Mark'
              : 'Mark as Untrustworthy'}
          </MenuText>
        </MenuItem>

        {!contact.isFriend && !isUser && (
          <MenuItem
            onClick={() => {
              contactsDispatch({ type: 'toggleBlocked', payload: { id } })
              setShowMenu(false)
            }}
          >
            <BlockSvg width={16} height={16} className="red" />
            <MenuText className="red">
              {contact.blocked ? 'Unblock User' : 'Block User'}
            </MenuText>
          </MenuItem>
        )}
      </MenuSection>
    </ContactDropdown>
  )
}

const ContactDropdown = styled(DropdownMenu)`
  top: 20px;
  left: 0px;
  width: 222px;
`

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const MenuSection = styled.div`
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid ${({ theme }) => theme.inputColor};
`

const UserNameWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
`

const UserName = styled.p`
  color: ${({ theme }) => theme.primary};
  margin-right: 4px;

  ${textMediumStyles}
`

const UserTrueName = styled.p`
  color: ${({ theme }) => theme.primary};
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  margin-top: 4px;
`
