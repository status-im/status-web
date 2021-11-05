import React, { useState } from "react";
import styled from "styled-components";

import { useNarrow } from "../contexts/narrowProvider";

import { Channels } from "./Channels/Channels";
import { ChatBody } from "./Chat/ChatBody";
import { ChatCreation } from "./Chat/ChatCreation";
import { Community } from "./Community";
import { Members } from "./Members/Members";
import { CommunityModal } from "./Modals/CommunityModal";
import { EditModal } from "./Modals/EditModal";

export function Chat() {
  const [showMembers, setShowMembers] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const [membersList, setMembersList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [createChat, setCreateChat] = useState(false);

  const narrow = useNarrow();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);

  const [isEditVisible, setIsEditVisible] = useState(false);
  const showEditModal = () => setIsEditVisible(true);

  return (
    <ChatWrapper>
      {showChannels && !narrow && (
        <ChannelsWrapper>
          <StyledCommunity onClick={showModal} />
          <Channels
            membersList={membersList}
            groupList={groupList}
            setCreateChat={setCreateChat}
          />
        </ChannelsWrapper>
      )}

      {!createChat && (
        <ChatBody
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          showCommunity={!showChannels}
          onCommunityClick={showModal}
          onEditClick={showEditModal}
          membersList={membersList}
          groupList={groupList}
          setMembersList={setMembersList}
          setGroupList={setGroupList}
          setCreateChat={setCreateChat}
        />
      )}
      {showMembers && !narrow && !createChat && (
        <Members
          setShowChannels={setShowChannels}
          setMembersList={setMembersList}
        />
      )}
      {createChat && (
        <ChatCreation
          setMembersList={setMembersList}
          setGroupList={setGroupList}
          setCreateChat={setCreateChat}
        />
      )}
      <CommunityModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        subtitle="Public Community"
      />
      <EditModal
        isVisible={isEditVisible}
        onClose={() => setIsEditVisible(false)}
      />
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
`;

const ChannelsWrapper = styled.div`
  width: 21%;
  height: 100%;
  min-width: 196px;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 10px 16px;
  display: flex;
  flex-direction: column;
`;

const StyledCommunity = styled(Community)`
  padding: 0 0 0 8px;
  margin: 0 0 16px;
`;
