import { BaseEmoji } from 'emoji-mart'
import React, { useMemo, useRef } from 'react'
import styled from 'styled-components'

import { useUserPublicKey } from '../../contexts/identityProvider'
import { useMessengerContext } from '../../contexts/messengerProvider'
import { useClickOutside } from '../../hooks/useClickOutside'
import { useClickPosition } from '../../hooks/useClickPosition'
import { useContextMenu } from '../../hooks/useContextMenu'
import { Reply } from '../../hooks/useReply'
import { ChatMessage } from '../../models/ChatMessage'
import { DeleteIcon } from '../Icons/DeleteIcon'
import { EditIcon } from '../Icons/EditIcon'
import { PinIcon } from '../Icons/PinIcon'
import { ReplySvg } from '../Icons/ReplyIcon'
import { ReactionPicker } from '../Reactions/ReactionPicker'

import { DropdownMenu, MenuItem, MenuSection, MenuText } from './DropdownMenu'

interface MessageMenuProps {
  message: ChatMessage
  messageReactions: BaseEmoji[]
  setMessageReactions: React.Dispatch<React.SetStateAction<BaseEmoji[]>>
  setReply: (val: Reply | undefined) => void
  messageRef: React.MutableRefObject<null>
}

export const MessageMenu = ({
  message,
  messageReactions,
  setMessageReactions,
  setReply,
  messageRef,
}: MessageMenuProps) => {
  const userPK = useUserPublicKey()
  const { activeChannel } = useMessengerContext()
  const { showMenu, setShowMenu } = useContextMenu(message.id)
  const { topPosition, leftPosition } = useClickPosition(messageRef)

  const menuStyle = useMemo(() => {
    return {
      top: topPosition,
      left: leftPosition,
    }
  }, [topPosition, leftPosition])

  const ref = useRef(null)
  useClickOutside(ref, () => setShowMenu(false))

  const userMessage = useMemo(
    () => !!userPK && message.sender === userPK,
    [userPK, message]
  )

  return userPK && showMenu ? (
    <MessageDropdown style={menuStyle} menuRef={ref} id="messageDropdown">
      <MenuItem className="picker">
        <ReactionPicker
          messageReactions={messageReactions}
          setMessageReactions={setMessageReactions}
          className="menu"
        />
      </MenuItem>
      <MenuSection className={`${!userMessage && 'message'}`}>
        <MenuItem
          onClick={() => {
            setReply({
              sender: message.sender,
              content: message.content,
              image: message.image,
              id: message.id,
            })
            setShowMenu(false)
          }}
        >
          <ReplySvg width={16} height={16} className="menu" />
          <MenuText>Reply</MenuText>
        </MenuItem>

        {userMessage && (
          <MenuItem
            onClick={() => {
              setShowMenu(false)
            }}
          >
            <EditIcon width={16} height={16} />
            <MenuText>Edit</MenuText>
          </MenuItem>
        )}
        {activeChannel?.type !== 'channel' && (
          <MenuItem
            onClick={() => {
              setShowMenu(false)
            }}
          >
            <PinIcon width={16} height={16} className="menu" />
            <MenuText>Pin</MenuText>
          </MenuItem>
        )}
      </MenuSection>
      {userMessage && (
        <MenuItem
          onClick={() => {
            setShowMenu(false)
          }}
        >
          <DeleteIcon width={16} height={16} className="red" />
          <MenuText className="red">Delete message</MenuText>
        </MenuItem>
      )}
    </MessageDropdown>
  ) : (
    <></>
  )
}

const MessageDropdown = styled(DropdownMenu)`
  width: 176px;
`
