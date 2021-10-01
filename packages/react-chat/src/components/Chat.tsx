import React, { useState } from "react";
import styled from "styled-components";

import { ChannelData, channels } from "../helpers/channelsMock";
import { CommunityData } from "../helpers/communityMock";
import { useMessenger } from "../hooks/useMessenger";
import { Theme } from "../styles/themes";

import { Channels } from "./Channels";
import { ChatBody } from "./Chat/ChatBody";
import { Members } from "./Members";

interface ChatProps {
  theme: Theme;
  community: CommunityData;
}

export function Chat({ theme, community }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>(channels[0]);
  const [showMembers, setShowMembers] = useState(true);
  const [showChannels, setShowChannels] = useState(false);

  const {
    messenger,
    messages,
    sendMessage,
    notifications,
    clearNotifications,
  } = useMessenger(
    activeChannel.name,
    channels.map((channel) => channel.name)
  );

  return (
    <ChatWrapper>
      {showChannels && (
        <Channels
          notifications={notifications}
          clearNotifications={clearNotifications}
          theme={theme}
          community={community}
          setActiveChannel={setActiveChannel}
          activeChannelId={activeChannel.id}
        />
      )}
      {messenger ? (
        <ChatBody
          theme={theme}
          channel={activeChannel}
          messages={messages}
          sendMessage={sendMessage}
          onClick={() => setShowMembers(!showMembers)}
          showMembers={showMembers}
          community={community}
          showCommunity={!showChannels}
        />
      ) : (
        <Loading>Connecting to waku</Loading>
      )}
      {showMembers && (
        <Members
          theme={theme}
          channel={activeChannel}
          setShowChannels={setShowChannels}
        />
      )}
    </ChatWrapper>
  );
}

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  text-align: center;
  justify-content: center;
  align-items: center;
`;

const ChatWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;
