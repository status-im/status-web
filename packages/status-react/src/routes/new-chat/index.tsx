import React, { useCallback, useMemo, useState } from 'react'

import { BellIcon } from '~/src/icons/bell-icon'
// import styled from 'styled-components'
import { styled } from '~/src/styles/config'
import { Box, Button, IconButton, TextInput } from '~/src/system'

import { ActivityButton } from '../../components/ActivityCenter/ActivityButton'
import { BackButton } from '../../components/Buttons/BackButton'
import { buttonStyles } from '../../components/Buttons/buttonStyle'
import { ChatInput } from '../../components/Chat-legacy/ChatInput'
import { CrossIcon } from '../../components/Icons/CrossIcon'
import { Member } from '../../components/Members/Member'
import { SearchBlock } from '../../components/SearchBlock'
import { textMediumStyles } from '../../components/Text'
// import { ChatState, useChatState } from '../../contexts/chatStateProvider'
// import { useUserPublicKey } from '../../contexts/identityProvider'
// import { useMessengerContext } from '../../contexts/messengerProvider'
// import { useNarrow } from '../../contexts/narrowProvider'

// import type { ChannelData } from '../../models/ChannelData'

interface Props {
  setEditGroup?: (val: boolean) => void
  activeChannel?: ChannelData
}

export const NewChat = (props: Props) => {
  const { setEditGroup, activeChannel } = props

  const narrow = useNarrow()
  const userPK = useUserPublicKey()
  const [query, setQuery] = useState('')
  const [groupChatMembersIds, setGroupChatMembersIds] = useState<string[]>(
    activeChannel?.members?.map(member => member.id) ?? []
  )
  const { contacts, createGroupChat, addMembers } = useMessengerContext()

  const groupChatMembers = useMemo(
    () => groupChatMembersIds.map(id => contacts[id]).filter(e => !!e),
    [groupChatMembersIds, contacts]
  )

  const contactsList = useMemo(() => {
    return Object.values(contacts)
      .filter(
        member =>
          member.id.includes(query) ||
          member?.customName?.includes(query) ||
          member.trueName.includes(query)
      )
      .filter(member => !groupChatMembersIds.includes(member.id))
  }, [query, groupChatMembersIds, contacts])

  const setChatState = useChatState()[1]

  const addMember = useCallback(
    (member: string) => {
      setGroupChatMembersIds((prevMembers: string[]) => {
        if (
          prevMembers.find(mem => mem === member) ||
          prevMembers.length >= 5
        ) {
          return prevMembers
        } else {
          return [...prevMembers, member]
        }
      })
      setQuery('')
    },
    [setGroupChatMembersIds]
  )
  const removeMember = useCallback(
    (member: string) => {
      setGroupChatMembersIds(prev => prev.filter(e => e != member))
    },
    [setGroupChatMembersIds]
  )

  const createChat = useCallback(
    (group: string[]) => {
      if (userPK) {
        const newGroup = group.slice()
        newGroup.push(userPK)
        createGroupChat(newGroup)
        setChatState(ChatState.ChatBody)
      }
    },
    [userPK, createGroupChat, setChatState]
  )

  const handleCreationClick = useCallback(() => {
    if (!activeChannel) {
      createChat(groupChatMembers.map(member => member.id))
    } else {
      addMembers(
        groupChatMembers.map(member => member.id),
        activeChannel.id
      )
    }
    setEditGroup?.(false)
  }, [activeChannel, groupChatMembers, createChat, addMembers, setEditGroup])

  return (
    <Wrapper>
      <NavbarWrapper>
        <Box css={{ flex: 1 }}>
          <TextInput />
        </Box>
        <Button
          // disabled={groupChatMembers.length === 0}
          onClick={handleCreationClick}
        >
          Confirm
        </Button>
        <IconButton label="Show Activity Center">
          <BellIcon />
        </IconButton>
      </NavbarWrapper>
    </Wrapper>
  )

  // return (
  //   <Wrapper className={`${narrow && 'narrow'}`}>
  //     <CreationBar
  //       className={`${groupChatMembers.length === 5 && narrow && 'limit'}`}
  //     >
  //       {narrow && (
  //         <BackButton
  //           onBtnClick={() =>
  //             setEditGroup
  //               ? setEditGroup?.(false)
  //               : setChatState(ChatState.ChatBody)
  //           }
  //           className="narrow"
  //         />
  //       )}
  //       <Column>
  //         <InputBar>
  //           <InputText>To:</InputText>
  //           <StyledList>
  //             {groupChatMembers.map(member => (
  //               <StyledMember key={member.id}>
  //                 <StyledName>
  //                   {member?.customName?.slice(0, 10) ??
  //                     member.trueName.slice(0, 10)}
  //                 </StyledName>
  //                 <CloseButton onClick={() => removeMember(member.id)}>
  //                   <CrossIcon memberView={true} />
  //                 </CloseButton>
  //               </StyledMember>
  //             ))}
  //           </StyledList>
  //           {groupChatMembers.length < 5 && (
  //             <SearchMembers>
  //               <Input
  //                 value={query}
  //                 onInput={e => setQuery(e.currentTarget.value)}
  //               />
  //             </SearchMembers>
  //           )}
  //           {!narrow && groupChatMembers.length === 5 && (
  //             <LimitAlert>5 user Limit reached</LimitAlert>
  //           )}
  //         </InputBar>
  //         {narrow && groupChatMembers.length === 5 && (
  //           <LimitAlert className="narrow">5 user Limit reached</LimitAlert>
  //         )}
  //       </Column>
  //       <Button
  //         disabled={groupChatMembers.length === 0}
  //         onClick={handleCreationClick}
  //       >
  //         Confirm
  //       </Button>

  //       <IconButton label="Show Activity Center">
  //         <BellIcon />
  //       </IconButton>

  //       {!narrow && <ActivityButton className="creation" />}
  //       {!narrow && (
  //         <SearchBlock
  //           query={query}
  //           discludeList={groupChatMembersIds}
  //           onClick={addMember}
  //         />
  //       )}
  //     </CreationBar>
  //     {((!setEditGroup && groupChatMembers.length === 0) || narrow) &&
  //       Object.keys(contacts).length > 0 && (
  //         <Contacts>
  //           <ContactsHeading>Contacts</ContactsHeading>
  //           <ContactsList>
  //             {userPK && narrow
  //               ? contactsList.map(contact => (
  //                   <Contact key={contact.id}>
  //                     <Member
  //                       contact={contact}
  //                       isOnline={contact.online}
  //                       onClick={() => addMember(contact.id)}
  //                     />
  //                   </Contact>
  //                 ))
  //               : Object.values(contacts)
  //                   .filter(
  //                     e => e.id != userPK && !groupChatMembersIds.includes(e.id)
  //                   )
  //                   .map(contact => (
  //                     <Contact key={contact.id}>
  //                       <Member
  //                         contact={contact}
  //                         isOnline={contact.online}
  //                         onClick={() => addMember(contact.id)}
  //                       />
  //                     </Contact>
  //                   ))}
  //           </ContactsList>
  //         </Contacts>
  //       )}
  //     {!setEditGroup && Object.keys(contacts).length === 0 && (
  //       <EmptyContacts>
  //         <EmptyContactsHeading>
  //           You only can send direct messages to your Contacts.{' '}
  //         </EmptyContactsHeading>
  //         <EmptyContactsHeading>
  //           {' '}
  //           Send a contact request to the person you would like to chat with,
  //           you will be able to chat with them once they have accepted your
  //           contact request.
  //         </EmptyContactsHeading>
  //       </EmptyContacts>
  //     )}

  //     {!activeChannel && (
  //       <ChatInput
  //         createChat={createChat}
  //         group={groupChatMembers.map(member => member.id)}
  //       />
  //     )}
  // </Wrapper>
  // )
}

const Wrapper = styled('div', {
  flex: 1,
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
})

const NavbarWrapper = styled('div', {
  display: 'flex',
  alignItems: 'center',
  // justifyContent: 'space-between',
  gap: '$4',
  padding: '10px 16px',
})

// const Wrapper = styled.div`
//   height: 100%;
//   display: flex;
//   flex-direction: column;
//   justify-content: space-between;
//   flex: 1;
//   background-color: ${({ theme }) => theme.bodyBackgroundColor};
//   padding: 8px 16px;

//   &.narrow {
//     width: 100%;
//     max-width: 100%;
//   }
// `

// const CreationBar = styled.div`
//   display: flex;
//   align-items: center;
//   margin-bottom: 24px;
//   position: relative;

//   &.limit {
//     align-items: flex-start;
//   }
// `

// const Column = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   flex: 1;
//   margin-right: 16px;
//   overflow-x: hidden;
// `

// const InputBar = styled.div`
//   display: flex;
//   align-items: center;
//   width: 100%;
//   height: 44px;
//   background-color: ${({ theme }) => theme.inputColor};
//   border: 1px solid ${({ theme }) => theme.inputColor};
//   border-radius: 8px;
//   padding: 6px 16px;

//   ${textMediumStyles}
// `

// const Input = styled.input`
//   width: 100%;
//   min-width: 20px;
//   background-color: ${({ theme }) => theme.inputColor};
//   border: 1px solid ${({ theme }) => theme.inputColor};
//   outline: none;
//   resize: none;

//   ${textMediumStyles}

//   &:focus {
//     outline: none;
//     caret-color: ${({ theme }) => theme.notificationColor};
//   }
// `

// const InputText = styled.div`
//   color: ${({ theme }) => theme.secondary};
//   margin-right: 8px;
// `

// const CreationBtn = styled.button`
//   padding: 11px 24px;
//   ${buttonStyles}

//   &:disabled {
//     background: ${({ theme }) => theme.inputColor};
//     color: ${({ theme }) => theme.secondary};
//   }
// `

// const StyledList = styled.div`
//   display: flex;
//   overflow-x: scroll;
//   margin-right: 8px;

//   &::-webkit-scrollbar {
//     display: none;
//   }
// `

// const StyledMember = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 4px 4px 4px 8px;
//   background: ${({ theme }) => theme.tertiary};
//   color: ${({ theme }) => theme.bodyBackgroundColor};
//   border-radius: 8px;

//   & + & {
//     margin-left: 8px;
//   }
// `

// const StyledName = styled.p`
//   color: ${({ theme }) => theme.bodyBackgroundColor};

//   ${textMediumStyles}
// `

// const CloseButton = styled.button`
//   width: 20px;
//   height: 20px;
// `

// const Contacts = styled.div`
//   height: calc(100% - 44px);
//   display: flex;
//   flex-direction: column;
//   flex: 1;
//   overflow: auto;
// `

// const Contact = styled.div`
//   display: flex;
//   align-items: center;
//   padding: 12px 12px 0 16px;
//   border-radius: 8px;

//   &:hover {
//     background: ${({ theme }) => theme.inputColor};
//   }
// `

// const ContactsHeading = styled.p`
//   color: ${({ theme }) => theme.secondary};

//   ${textMediumStyles}
// `

// const ContactsList = styled.div`
//   display: flex;
//   flex-direction: column;
// `

// const EmptyContacts = styled(Contacts)`
//   justify-content: center;
//   align-items: center;
// `

// const EmptyContactsHeading = styled(ContactsHeading)`
//   max-width: 550px;
//   margin-bottom: 24px;
//   text-align: center;
// `

// const SearchMembers = styled.div`
//   position: relative;
//   flex: 1;
// `

// const LimitAlert = styled.p`
//   text-transform: uppercase;
//   margin-left: auto;
//   color: ${({ theme }) => theme.redColor};
//   white-space: nowrap;

//   &.narrow {
//     margin: 8px 0 0;
//   }
// `
