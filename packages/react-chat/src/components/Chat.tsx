import React, { useEffect, useMemo, useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useNarrow } from "../contexts/narrowProvider";
import { useMessenger } from "../hooks/messenger/useMessenger";
import { ChannelData } from "../models/ChannelData";
import { Metadata } from "../models/Metadata";
import { Theme } from "../styles/themes";
import { uintToImgUrl } from "../utils/uintToImgUrl";

import { Channels } from "./Channels/Channels";
import { ChatBody } from "./Chat/ChatBody";
import { Community } from "./Community";
import { Members } from "./Members/Members";
import { CommunityModal } from "./Modals/CommunityModal";
import { CommunitySkeleton } from "./Skeleton/CommunitySkeleton";

interface ChatProps {
  theme: Theme;
  communityKey: string;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
  identity: Identity;
}

export function Chat({
  theme,
  communityKey,
  fetchMetadata,
  identity,
}: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>({
    id: "",
    name: "",
    description: "",
  });
  const [showMembers, setShowMembers] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const [membersList, setMembersList] = useState([]);

  const narrow = useNarrow();

  const {
    messenger,
    messages,
    sendMessage,
    notifications,
    clearNotifications,
    loadPrevDay,
    loadingMessages,
    community,
    contacts,
  } = useMessenger(activeChannel?.id ?? "", communityKey, identity);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);

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
            notifications={notifications}
            clearNotifications={clearNotifications}
            onCommunityClick={(e) => setActiveChannel(e)}
            activeChannelId={activeChannel?.id ?? ""}
            channels={channels}
            membersList={membersList}
          />
        </ChannelsWrapper>
      )}
      <ChatBody
        identity={identity}
        contacts={contacts}
        theme={theme}
        channel={activeChannel}
        messenger={messenger}
        messages={messages}
        sendMessage={sendMessage}
        notifications={notifications}
        setActiveChannel={setActiveChannel}
        activeChannelId={activeChannel.id}
        onClick={() => setShowMembers(!showMembers)}
        showMembers={showMembers}
        community={communityData}
        showCommunity={!showChannels}
        loadPrevDay={() => loadPrevDay(activeChannel.id)}
        onCommunityClick={showModal}
        fetchMetadata={fetchMetadata}
        loadingMessages={loadingMessages}
        clearNotifications={clearNotifications}
        channels={channels}
        membersList={membersList}
        setMembersList={setMembersList}
      />
      {showMembers && !narrow && (
        <Members
          identity={identity}
          contacts={contacts}
          setShowChannels={setShowChannels}
          setMembersList={setMembersList}
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
