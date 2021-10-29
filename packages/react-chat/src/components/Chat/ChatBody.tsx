import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Identity } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { CommunityData } from "../../models/CommunityData";
import { Channel } from "../Channels/Channel";
import { EmptyChannel } from "../Channels/EmptyChannel";
import { Community } from "../Community";
import { MembersIcon } from "../Icons/MembersIcon";
import { NarrowChannels } from "../NarrowMode/NarrowChannels";
import { NarrowMembers } from "../NarrowMode/NarrowMembers";
import { CommunitySkeleton } from "../Skeleton/CommunitySkeleton";
import { Loading } from "../Skeleton/Loading";
import { LoadingSkeleton } from "../Skeleton/LoadingSkeleton";

import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

interface ChatBodyProps {
  identity: Identity;
  channel: ChannelData;
  community: CommunityData | undefined;
  onClick: () => void;
  showMembers: boolean;
  showCommunity: boolean;
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: string;
  onCommunityClick: () => void;
  channels: ChannelData[];
  membersList: string[];
  setMembersList: any;
  setCreateChat: (val: boolean) => void;
}

export function ChatBody({
  identity,
  channel,
  community,
  onClick,
  showMembers,
  showCommunity,
  setActiveChannel,
  activeChannelId,
  onCommunityClick,
  channels,
  membersList,
  setMembersList,
  setCreateChat,
}: ChatBodyProps) {
  const { messenger, messages } = useMessengerContext();
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
          {messenger && community ? (
            <>
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
            </>
          ) : (
            <CommunitySkeleton />
          )}
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
        {!community && <Loading />}
      </ChatTopbar>
      {messenger && community ? (
        <>
          {!showChannelsList && !showMembersList && (
            <>
              {messages.length > 0 ? (
                messenger && community ? (
                  <ChatMessages
                    messages={messages}
                    activeChannelId={activeChannelId}
                  />
                ) : (
                  <LoadingSkeleton />
                )
              ) : (
                <EmptyChannel channel={channel} />
              )}
              <ChatInput />
            </>
          )}

          {showChannelsList && narrow && (
            <NarrowChannels
              channels={channels}
              community={community.name}
              setActiveChannel={setActiveChannel}
              setShowChannels={setShowChannelsList}
              activeChannelId={activeChannelId}
              membersList={membersList}
              setCreateChat={setCreateChat}
            />
          )}
          {showMembersList && narrow && (
            <NarrowMembers
              identity={identity}
              community={community}
              setShowChannels={setShowChannelsList}
              setShowMembersList={setShowMembersList}
              setMembersList={setMembersList}
            />
          )}
        </>
      ) : (
        <>
          <LoadingSkeleton />
          <ChatInput />
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

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  &:active,
  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;
