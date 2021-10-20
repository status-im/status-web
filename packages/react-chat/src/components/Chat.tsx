import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useNarrow } from "../contexts/narrowProvider";
import { useMessenger } from "../hooks/useMessenger";
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
}

export function Chat({ theme, communityKey, fetchMetadata }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>({
    id: "",
    name: "",
    description: "",
  });
  const [showMembers, setShowMembers] = useState(true);
  const [showChannels, setShowChannels] = useState(true);
  const narrow = useNarrow();

  const {
    messenger,
    messages,
    sendMessage,
    notifications,
    clearNotifications,
    loadNextDay,
    loadingMessages,
    community,
  } = useMessenger(activeChannel?.id ?? "", communityKey);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);

  const communityData = useMemo(() => {
    if (community?.description) {
      console.log(Object.keys(community.description.proto.members));
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
      return {
        id: 1,
        name: "",
        icon: "",
        members: 0,
        membersList: [],
        description: "",
      };
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
          {messenger ? (
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
          />
        </ChannelsWrapper>
      )}
      <ChatBody
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
        loadNextDay={() => loadNextDay(activeChannel.name)}
        onCommunityClick={showModal}
        fetchMetadata={fetchMetadata}
        loadingMessages={loadingMessages}
        clearNotifications={clearNotifications}
        channels={channels}
      />
      {showMembers && !narrow && (
        <Members community={communityData} setShowChannels={setShowChannels} />
      )}
      <CommunityModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        icon={communityData.icon}
        name={communityData.name}
        subtitle="Public Community"
        description={communityData.description}
        publicKey={communityKey}
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
  padding: 10px 0.6%;
  display: flex;
  flex-direction: column;
`;

const StyledCommunity = styled(Community)`
  padding: 0 0 0 10px;
  margin: 0 0 16px;
`;
