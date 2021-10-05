import React, { useState } from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../helpers/channelsMock";
import { CommunityData } from "../../helpers/communityMock";
import { ChatMessage } from "../../models/ChatMessage";
import { Theme } from "../../styles/themes";
import { Channel } from "../Channels";
import { Community } from "../Community";
import { MembersIcon } from "../Icons/MembersIcon";
import { NarrowChannels } from "../NarrowMode/NarrowChannels";
import { NarrowTopbar } from "../NarrowMode/NarrowTopbar";


import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";
import { EmptyChannel } from "./EmptyChannel";

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
  community: CommunityData;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  onClick: () => void;
  showMembers: boolean;
  showCommunity: boolean;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
}

export function ChatBody({
  theme,
  channel,
  community,
  messages,
  sendMessage,
  onClick,
  showMembers,
  showCommunity,
  notifications,
  setActiveChannel,
  activeChannelId,
}: ChatBodyProps) {
  const narrow = useNarrow();
  const [showChannelsList, setShowChannels] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);

  return (
    <ChatBodyWrapper theme={theme}>
      <ChatTopbar>
        <ChannelWrapper>
          {(showCommunity || narrow) && (
            <CommunityWrap theme={theme}>
              <Community community={community} theme={theme} />
            </CommunityWrap>
          )}
          <Channel
            channel={channel}
            theme={theme}
            isActive={true}
            activeView={true}
            isMuted={false}
            onClick={() => (narrow ? setShowChannels(true) : undefined)}
          />
        </ChannelWrapper>
        <MemberBtn
          onClick={narrow ? () => setShowMembersList(true) : onClick}
          className={showMembers ? "active" : ""}
          theme={theme}
        >
          <MembersIcon theme={theme} />
        </MemberBtn>
      </ChatTopbar>
      {!showChannelsList &&
        !showMembersList &&
        (messages.length > 0 ? (
          <ChatMessages messages={messages} theme={theme} />
        ) : (
          <EmptyChannel theme={theme} channel={channel} />
        ))}
      <ChatInput theme={theme} addMessage={sendMessage} />
      {showChannelsList && narrow && (
        <NarrowChannels
          theme={theme}
          community={community.name}
          notifications={notifications}
          setActiveChannel={setActiveChannel}
          setShowChannels={setShowChannels}
          activeChannelId={activeChannelId}
        />
      )}
      {showMembersList && narrow && (
        <NarrowTopbar
          theme={theme}
          list="Community members"
          community={community.name}
          onClick={() => setShowMembersList(false)}
        />
      )}
    </ChatBodyWrapper>
  );
}
interface ThemeProps {
  theme: Theme;
}

const ChatBodyWrapper = styled.div<ThemeProps>`
  display: flex;
  flex-direction: column;
  flex: 1;
  height: 100%;
  background: ${({ theme }) => theme.bodyBackgroundColor};
`;

const ChannelWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const ChatTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
`;

const CommunityWrap = styled.div<ThemeProps>`
  padding-right: 16px;
  margin-right: 16px;
  position: relative;

  &:after {
    content: "";
    position: absolute;
    right: 0;
    top: 50%;
    width: 2px;
    height: 24px;
    transform: translateY(-50%);
    border-radius: 1px;
    background: ${({ theme }) => theme.primary};
    opacity: 0.1;
  }
`;

const MemberBtn = styled.button<ThemeProps>`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;
  margin-top: 12px;

  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;
