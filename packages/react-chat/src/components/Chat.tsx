import React, { useMemo, useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";
import { useNarrow } from "../contexts/narrowProvider";
import { uintToImgUrl } from "../utils/uintToImgUrl";

import { Channels } from "./Channels/Channels";
import { ChatBody } from "./Chat/ChatBody";
import { ChatCreation } from "./Chat/ChatCreation";
import { Community } from "./Community";
import { Members } from "./Members/Members";
import { CommunityModal } from "./Modals/CommunityModal";
import { EditModal } from "./Modals/EditModal";
import { CommunitySkeleton } from "./Skeleton/CommunitySkeleton";

interface ChatProps {
  identity: Identity;
}

export function Chat({ identity }: ChatProps) {
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

  const { community } = useMessengerContext();
  const communityData = useMemo(() => {
    if (community?.description) {
      return {
        id: community.publicKeyStr,
        name: community.description.identity?.displayName ?? "",
        icon: uintToImgUrl(
          community.description?.identity?.images?.thumbnail.payload ??
            new Uint8Array()
        ),
        members: 0,
        membersList: Object.keys(community.description.proto.members),
        description: community.description.identity?.description ?? "",
      };
    } else {
      return undefined;
    }
  }, [community]);

  return (
    <ChatWrapper>
      {showChannels && !narrow && (
        <ChannelsWrapper>
          {communityData ? (
            <StyledCommunity onClick={showModal} community={communityData} />
          ) : (
            <CommunitySkeleton />
          )}
          <Channels
            membersList={membersList}
            groupList={groupList}
            setCreateChat={setCreateChat}
          />
        </ChannelsWrapper>
      )}

      {!createChat && (
        <ChatBody
          identity={identity}
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          community={communityData}
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
          identity={identity}
          setShowChannels={setShowChannels}
          setMembersList={setMembersList}
        />
      )}
      {createChat && communityData && (
        <ChatCreation
          identity={identity}
          community={communityData}
          setMembersList={setMembersList}
          setGroupList={setGroupList}
          setCreateChat={setCreateChat}
        />
      )}
      {communityData && (
        <CommunityModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          community={communityData}
          subtitle="Public Community"
        />
      )}
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
