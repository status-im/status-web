import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { Channel } from "../Channels/Channel";
import { Community } from "../Community";
import { ChannelMenu } from "../Form/ChannelMenu";
import { MembersIcon } from "../Icons/MembersIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { NarrowChannels } from "../NarrowMode/NarrowChannels";
import { NarrowMembers } from "../NarrowMode/NarrowMembers";
import { CommunitySkeleton } from "../Skeleton/CommunitySkeleton";
import { Loading } from "../Skeleton/Loading";
import { LoadingSkeleton } from "../Skeleton/LoadingSkeleton";

import { ChatCreation } from "./ChatCreation";
import { ChatInput } from "./ChatInput";
import { ChatMessages } from "./ChatMessages";

enum ChatBodyState {
  Chat,
  Channels,
  Members,
}

interface ChatBodyProps {
  onClick: () => void;
  showMembers: boolean;
  setCreateChat: (val: boolean) => void;
}

export function ChatBody({
  onClick,
  showMembers,
  setCreateChat,
}: ChatBodyProps) {
  const { messenger, activeChannel, communityData } = useMessengerContext();
  const narrow = useNarrow();
  const [showChannelMenu, setShowChannelMenu] = useState(false);

  const [editGroup, setEditGroup] = useState(false);
  const className = useMemo(() => (narrow ? "narrow" : ""), [narrow]);

  const [showState, setShowState] = useState<ChatBodyState>(ChatBodyState.Chat);
  const switchShowState = useCallback(
    (state: ChatBodyState) => {
      if (narrow) {
        setShowState((prev) => (prev === state ? ChatBodyState.Chat : state));
      }
    },
    [narrow]
  );

  useEffect(() => {
    if (!narrow) {
      setShowState(ChatBodyState.Chat);
    }
  }, [narrow]);

  return (
    <ChatBodyWrapper className={className}>
      {editGroup && communityData ? (
        <ChatCreation setCreateChat={setCreateChat} editGroup={editGroup} />
      ) : (
        <ChatTopbar
          className={narrow && showState !== ChatBodyState.Chat ? "narrow" : ""}
        >
          <ChannelWrapper className={className}>
            {messenger && communityData ? (
              <>
                {narrow && (
                  <CommunityWrap className={className}>
                    <Community />
                  </CommunityWrap>
                )}

                <Channel
                  channel={activeChannel}
                  isActive={
                    narrow ? showState === ChatBodyState.Channels : true
                  }
                  activeView={true}
                  isMuted={false}
                  onClick={() => switchShowState(ChatBodyState.Channels)}
                />
              </>
            ) : (
              <SkeletonWrapper>
                <CommunitySkeleton />
              </SkeletonWrapper>
            )}
          </ChannelWrapper>

          <MenuWrapper>
            {!narrow && (
              <MemberBtn
                onClick={onClick}
                className={showMembers ? "active" : ""}
              >
                <MembersIcon />
              </MemberBtn>
            )}
            <MoreBtn onClick={() => setShowChannelMenu(!showChannelMenu)}>
              <MoreIcon />
            </MoreBtn>
          </MenuWrapper>
          {!messenger && !communityData && <Loading />}
          {showChannelMenu && (
            <ChannelMenu
              channel={activeChannel}
              switchMemberList={() => switchShowState(ChatBodyState.Members)}
              setShowChannelMenu={setShowChannelMenu}
              setEditGroup={setEditGroup}
            />
          )}
        </ChatTopbar>
      )}
      {messenger ? (
        <>
          {showState === ChatBodyState.Chat && (
            <>
              {messenger && communityData ? (
                <ChatMessages />
              ) : (
                <LoadingSkeleton />
              )}
              <ChatInput />
            </>
          )}

          {showState === ChatBodyState.Channels && (
            <NarrowChannels
              setShowChannels={() => switchShowState(ChatBodyState.Channels)}
              setCreateChat={setCreateChat}
            />
          )}
          {showState === ChatBodyState.Members && (
            <NarrowMembers
              switchShowMembersList={() =>
                switchShowState(ChatBodyState.Members)
              }
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
  width: 61%;
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
  max-width: 85%;

  &.narrow {
    width: calc(100% - 46px);
  }
`;

const SkeletonWrapper = styled.div`
  padding: 8px;
`;

const ChatTopbar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const MenuWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const MemberBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  &:active,
  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;

const MoreBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;
  margin: 0 8px;

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  &:active,
  &.active {
    background: ${({ theme }) => theme.inputColor};
  }
`;
