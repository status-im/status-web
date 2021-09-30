import React, { useState } from 'react';
import styled from 'styled-components';

import { ChannelData, channels } from '../helpers/channelsMock';
import { useMessenger } from '../hooks/useMessenger';
import { Theme } from '../styles/themes';

import { Channels } from './Channels';
import { ChatBody } from './Chat/ChatBody';
import { Members } from './Members';

interface ChatProps {
  theme: Theme;
  channelsON?: boolean;
}

export function Chat({ theme, channelsON }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>(channels[0]);
  const [showMembers, setShowMembers] = useState(true);

  const { messenger, messages, sendMessage, notifications, clearNotifications } = useMessenger(
    activeChannel.name,
    channels.map(channel => channel.name)
  );

  return (
    <ChatWrapper>
      {channelsON && (
        <Channels
          notifications={notifications}
          clearNotifications={clearNotifications}
          theme={theme}
          icon={'https://www.cryptokitties.co/icons/logo.svg'}
          name={'CryptoKitties'}
          members={186}
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
        />
      ) : (
        <Loading>Connecting to waku</Loading>
      )}
      {showMembers && <Members theme={theme} channel={activeChannel} />}
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
