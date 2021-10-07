import React, { useCallback, useMemo, useState } from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../helpers/channelsMock";
import { CommunityData } from "../../helpers/communityMock";
import { ChatMessage } from "../../models/ChatMessage";
import { Theme } from "../../styles/themes";
import { Channel } from "../Channels";
import { Community } from "../Community";
import { EmptyChannel } from "../EmptyChannel";
import { MembersIcon } from "../Icons/MembersIcon";
import { NarrowChannels } from "../NarrowMode/NarrowChannels";
import { NarrowMembers } from "../NarrowMode/NarrowMembers";
import { Loading } from "../Skeleton/Loading";
import { LoadingSkeleton } from "../Skeleton/LoadingSkeleton";

import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

interface ChatBodyProps {
  theme: Theme;
  channel: ChannelData;
  community: CommunityData;
  messenger: any;
  messages: ChatMessage[];
  sendMessage: (text: string) => void;
  onClick: () => void;
  showMembers: boolean;
  showCommunity: boolean;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
  loadNextDay: () => void;
  lastMessage: Date;
}

export function ChatBody({
  theme,
  channel,
  community,
  messenger,
  messages,
  sendMessage,
  onClick,
  showMembers,
  showCommunity,
  notifications,
  setActiveChannel,
  activeChannelId,
  loadNextDay,
  lastMessage,
}: ChatBodyProps) {
  const narrow = useNarrow();
  const [showChannelsList, setShowChannelsList] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const className = useMemo(() => (narrow ? "narrow" : ""), [narrow]);

  const switchChannelList = useCallback(() => {
    setShowMembersList(false);
    setShowChannelsList(!showChannelsList);
  }, [showChannelsList]);

  const switchMemberList = useCallback(() => {
    setShowChannelsList(false);
    setShowMembersList(!showMembersList);
  }, [showMembersList]);

  return (
    <ChatBodyWrapper theme={theme} className={className}>
      <ChatTopbar
        className={
          narrow && (showChannelsList || showMembersList) ? "narrow" : ""
        }
        theme={theme}
      >
        <ChannelWrapper className={className}>
          {(showCommunity || narrow) && (
            <CommunityWrap theme={theme} className={className}>
              <Community community={community} theme={theme} />
            </CommunityWrap>
          )}
          <Channel
            channel={channel}
            theme={theme}
            isActive={narrow ? showChannelsList : true}
            activeView={true}
            isMuted={false}
            onClick={() => (narrow ? switchChannelList() : undefined)}
          />
        </ChannelWrapper>
        <MemberBtn
          onClick={narrow ? () => switchMemberList() : onClick}
          className={
            (showMembers && !narrow) || (showMembersList && narrow)
              ? "active"
              : ""
          }
          theme={theme}
        >
          <MembersIcon theme={theme} />
        </MemberBtn>
        {!messenger && <Loading theme={theme} />}
      </ChatTopbar>
      {messenger ? (
        <>
          {!showChannelsList && !showMembersList && (
            <>
              <button onClick={loadNextDay}>
                Last message date {lastMessage.toDateString()}
              </button>{" "}
              {messages.length > 0 ? (
                messenger ? (
                  <ChatMessages messages={messages} theme={theme} />
                ) : (
                  <LoadingSkeleton theme={theme} />
                )
              ) : (
                <EmptyChannel theme={theme} channel={channel} />
              )}
              <ChatInput theme={theme} addMessage={sendMessage} />
            </>
          )}

          {showChannelsList && narrow && (
            <NarrowChannels
              theme={theme}
              community={community.name}
              notifications={notifications}
              setActiveChannel={setActiveChannel}
              setShowChannels={setShowChannelsList}
              activeChannelId={activeChannelId}
            />
          )}
          {showMembersList && narrow && (
            <NarrowMembers
              theme={theme}
              community={community}
              setShowChannels={setShowChannelsList}
              setShowMembersList={setShowMembersList}
            />
          )}
        </>
      ) : (
        <>
          <LoadingSkeleton theme={theme} />
          <ChatInput theme={theme} addMessage={sendMessage} />
        </>
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

  &.narrow {
    width: 100%;
  }
`;

const ChannelWrapper = styled.div`
  display: flex;
  align-items: center;

  &.narrow {
    width: calc(100% - 46px);
  }
`;

const ChatTopbar = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  padding: 5px 8px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;

  &.narrow {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 2;
  }
`;

const CommunityWrap = styled.div<ThemeProps>`
  padding-right: 10px;
  margin-right: 16px;
  position: relative;

  &.narrow {
    margin-right: 8px;
  }

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
