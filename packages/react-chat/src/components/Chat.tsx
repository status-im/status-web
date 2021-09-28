import React, { useState } from 'react';
import styled from 'styled-components';

import { ChannelData, channels } from '../helpers/channelsMock';
import { Theme } from '../styles/themes';

import { Channels } from './Channels';
import { ChatBody } from './Chat/ChatBody';
import { Members } from './Members';

interface ChatProps {
  theme: Theme;
  channelsON?: boolean;
  membersON?: boolean;
}

export function Chat({ theme, channelsON, membersON }: ChatProps) {
  const [activeChannel, setActiveChannel] = useState<ChannelData>(channels[0]);

  return (
    <ChatWrapper>
      {channelsON && (
        <Channels
          theme={theme}
          icon={'https://www.cryptokitties.co/icons/logo.svg'}
          name={'CryptoKitties'}
          members={186}
          setActiveChannel={setActiveChannel}
          activeChannelId={activeChannel.id}
        />
      )}
      <ChatBody theme={theme} channel={activeChannel} />
      {membersON && <Members theme={theme} />}
    </ChatWrapper>
  );
}

const ChatWrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;
