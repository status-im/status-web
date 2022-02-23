import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useMessengerContext } from '../contexts/messengerProvider'

import { ContactsList } from './Chat/ChatCreation'
import { Member } from './Members/Member'

interface SearchBlockProps {
  query: string
  discludeList: string[]
  onClick: (member: string) => void
  onBotttom?: boolean
}

export const SearchBlock = ({
  query,
  discludeList,
  onClick,
  onBotttom,
}: SearchBlockProps) => {
  const { contacts } = useMessengerContext()

  const searchList = useMemo(() => {
    return Object.values(contacts)
      .filter(
        member =>
          member.id.includes(query) ||
          member?.customName?.includes(query) ||
          member.trueName.includes(query)
      )
      .filter(member => !discludeList.includes(member.id))
  }, [query, discludeList, contacts])

  if (searchList.length === 0 || !query) {
    return null
  }
  return (
    <SearchContacts
      style={{ [onBotttom ? 'bottom' : 'top']: 'calc(100% + 24px)' }}
    >
      <ContactsList>
        {searchList.map(member => (
          <SearchContact key={member.id}>
            <Member contact={member} onClick={() => onClick(member.id)} />
          </SearchContact>
        ))}
      </ContactsList>
    </SearchContacts>
  )
}

const SearchContacts = styled.div`
  display: flex;
  flex-direction: column;
  width: 360px;
  padding: 8px;
  background-color: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  position: absolute;
  left: 0;
  max-height: 200px;
  overflow: auto;
`

const SearchContact = styled.div`
  width: 340px;
  display: flex;
  align-items: center;
  padding: 12px 12px 0 16px;
  border-radius: 8px;

  &:hover {
    background: ${({ theme }) => theme.inputColor};
  }
`
