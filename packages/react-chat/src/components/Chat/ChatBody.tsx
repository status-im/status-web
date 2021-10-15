import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../helpers/channelsMock";
import { CommunityData } from "../../helpers/communityMock";
import { ChatMessage } from "../../models/ChatMessage";
import { Metadata } from "../../models/Metadata";
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
  sendMessage: (text: string, image?: Uint8Array) => void;
  onClick: () => void;
  showMembers: boolean;
  showCommunity: boolean;
  notifications: { [id: string]: number };
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
  loadNextDay: () => void;
  onCommunityClick: () => void;
  fetchMetadata?: (url: string) => Promise<Metadata | undefined>;
  loadingMessages: boolean;
  clearNotifications: (id: string) => void;
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
  onCommunityClick,
  fetchMetadata,
  loadingMessages,
  clearNotifications,
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

  useEffect(() => {
    if (!narrow) {
      setShowChannelsList(false);
      setShowMembersList(false);
    }
  }, [narrow]);

  return (
    <ChatBodyWrapper className={className}>
      <ChatTopbar
        className={
          narrow && (showChannelsList || showMembersList) ? "narrow" : ""
        }
      >
        <ChannelWrapper className={className}>
          {(showCommunity || narrow) && (
            <CommunityWrap className={className}>
              <Community onClick={onCommunityClick} community={community} />
            </CommunityWrap>
          )}
          <Channel
            channel={channel}
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
        >
          <MembersIcon />
        </MemberBtn>
        {!messenger && <Loading />}
      </ChatTopbar>
      {messenger ? (
        <>
          {!showChannelsList && !showMembersList && (
            <>
              {messages.length > 0 ? (
                messenger ? (
                  <ChatMessages
                    messages={messages}
                    loadNextDay={loadNextDay}
                    fetchMetadata={fetchMetadata}
                    loadingMessages={loadingMessages}
                  />
                ) : (
                  <LoadingSkeleton />
                )
              ) : (
                <EmptyChannel channel={channel} />
              )}
              <ChatInput addMessage={sendMessage} theme={theme} />
            </>
          )}

          {showChannelsList && narrow && (
            <NarrowChannels
              community={community.name}
              notifications={notifications}
              setActiveChannel={setActiveChannel}
              setShowChannels={setShowChannelsList}
              activeChannelId={activeChannelId}
              clearNotifications={clearNotifications}
            />
          )}
          {showMembersList && narrow && (
            <NarrowMembers
              community={community}
              setShowChannels={setShowChannelsList}
              setShowMembersList={setShowMembersList}
            />
          )}
        </>
      ) : (
        <>
          <LoadingSkeleton />
          <ChatInput addMessage={sendMessage} theme={theme} />
        </>
      )}
    </ChatBodyWrapper>
  );
}

const ChatBodyWrapper = styled.div`
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

const ChatTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 5px 8px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  position: relative;

  &.narrow {
    width: 100%;
  }
`;

const CommunityWrap = styled.div`
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

const MemberBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;
  margin-top: 12px;

  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;
