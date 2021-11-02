import React, { useEffect, useMemo, useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";
import { useNarrow } from "../contexts/narrowProvider";
import { ChannelData } from "../models/ChannelData";
import { uintToImgUrl } from "../utils/uintToImgUrl";

import { Channels } from "./Channels/Channels";
import { ChatBody } from "./Chat/ChatBody";
import { ChatCreation } from "./Chat/ChatCreation";
import { Community } from "./Community";
import { Members } from "./Members/Members";
import { CommunityModal } from "./Modals/CommunityModal";
import { EditModal } from "./Modals/EdtModal";
import { CommunitySkeleton } from "./Skeleton/CommunitySkeleton";

interface ChatProps {
  communityKey: string;
  identity: Identity;
  setActiveChannel: (channel: ChannelData) => void;
  activeChannel: ChannelData;
}

export function Chat({
  communityKey,
  identity,
  setActiveChannel,
  activeChannel,
}: ChatProps) {
  const [showMembers, setShowMembers] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const [membersList, setMembersList] = useState([]);
  const [createChat, setCreateChat] = useState(false);

  const narrow = useNarrow();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);

  const { community } = useMessengerContext();

  const communityData = useMemo(() => {
    if (community?.description) {
      return {
        id: 1,
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

  const channels = useMemo(() => {
    if (community?.chats) {
      return Array.from(community.chats.values()).map((chat) => {
        return {
          id: chat.id,
          name: chat.communityChat?.identity?.displayName ?? "",
          description: chat.communityChat?.identity?.description ?? "",
        };
      });
    } else {
      return [];
    }
  }, [community]);

  useEffect(() => {
    if (channels.length > 0) setActiveChannel(channels[0]);
  }, [channels]);

  return (
    <ChatWrapper>
      {showChannels && !narrow && (
        <ChannelsWrapper>
          {community && communityData ? (
            <StyledCommunity onClick={showModal} community={communityData} />
          ) : (
            <CommunitySkeleton />
          )}
          <Channels
            onCommunityClick={(e) => setActiveChannel(e)}
            activeChannelId={activeChannel?.id ?? ""}
            channels={channels}
            membersList={membersList}
            setCreateChat={setCreateChat}
          />
        </ChannelsWrapper>
      )}

      {!createChat && (
        <ChatBody
          identity={identity}
          channel={activeChannel}
          setActiveChannel={setActiveChannel}
          activeChannelId={activeChannel.id}
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          community={communityData}
          showCommunity={!showChannels}
          onModalClick={showModal}
          channels={channels}
          membersList={membersList}
          setMembersList={setMembersList}
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
          community={communityData}
          setMembersList={setMembersList}
          setActiveChannel={setActiveChannel}
          setCreateChat={setCreateChat}
        />
      )}
      {communityData && (
        <CommunityModal
          isVisible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          icon={communityData.icon}
          name={communityData.name}
          subtitle="Public Community"
          description={communityData.description}
          publicKey={communityKey}
        />
      )}
      <EditModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
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
