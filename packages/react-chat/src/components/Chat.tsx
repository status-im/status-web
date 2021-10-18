import React, { useState } from "react";
import styled from "styled-components";

import { useNarrow } from "../contexts/narrowProvider";
import { ChannelData, channels } from "../helpers/channelsMock";
import { CommunityData } from "../helpers/communityMock";
import { useMessenger } from "../hooks/useMessenger";
import { Metadata } from "../models/Metadata";
import { Theme } from "../styles/themes";

import { Channels } from "./Channels/Channels";
import { ChatBody } from "./Chat/ChatBody";
import { Community } from "./Community";
import { Members } from "./Members";
import { CommunityModal } from "./Modals/CommunityModal";

interface ChatProps {
  theme: Theme;
  community: CommunityData;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
}

export function Chat({ theme, community, fetchMetadata }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>(channels[0]);
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
  } = useMessenger(
    activeChannel.name,
    channels.map((channel) => channel.name)
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => setIsModalVisible(true);

  return (
    <ChatWrapper>
      {showChannels && !narrow && (
        <ChannelsWrapper>
          <StyledCommunity onClick={showModal} community={community} />
          <Channels
            notifications={notifications}
            clearNotifications={clearNotifications}
            onCommunityClick={(e) => setActiveChannel(e)}
            activeChannelId={activeChannel.id}
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
        community={community}
        showCommunity={!showChannels}
        loadNextDay={() => loadNextDay(activeChannel.name)}
        onCommunityClick={showModal}
        fetchMetadata={fetchMetadata}
        loadingMessages={loadingMessages}
        clearNotifications={clearNotifications}
      />
      {showMembers && !narrow && (
        <Members community={community} setShowChannels={setShowChannels} />
      )}
      <CommunityModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        icon={community.icon}
        name={community.name}
        subtitle="Public Community"
        description={community.description}
        publicKey="0xD95DBdaB08A9FED2D71ac9C3028AAc40905d8CF3"
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
