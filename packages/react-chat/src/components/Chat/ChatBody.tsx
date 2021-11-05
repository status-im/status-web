import React, { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { CommunityData } from "../../models/CommunityData";
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

interface ChatBodyProps {
  community: CommunityData | undefined;
  onClick: () => void;
  showMembers: boolean;
  showCommunity: boolean;
  onCommunityClick: () => void;
  onEditClick: () => void;
  membersList: string[];
  groupList: [][];
  setMembersList: any;
  setGroupList: any;
  setCreateChat: (val: boolean) => void;
}

export function ChatBody({
  community,
  onClick,
  showMembers,
  showCommunity,
  onCommunityClick,
  onEditClick,
  membersList,
  groupList,
  setMembersList,
  setGroupList,
  setCreateChat,
}: ChatBodyProps) {
  const { messenger, messages, activeChannel } = useMessengerContext();
  const narrow = useNarrow();
  const [showChannelsList, setShowChannelsList] = useState(false);
  const [showMembersList, setShowMembersList] = useState(false);
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [editGroup, setEditGroup] = useState(false);
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
      {editGroup && community ? (
        <ChatCreation
          community={community}
          setMembersList={setMembersList}
          setGroupList={setGroupList}
          setCreateChat={setCreateChat}
          editGroup={editGroup}
        />
      ) : (
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
                    <Community
                      onClick={onCommunityClick}
                      community={community}
                    />
                  </CommunityWrap>
                )}

                <Channel
                  channel={activeChannel}
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

          <MenuWrapper>
            {!narrow && (
              <MemberBtn
                onClick={onClick}
                className={showMembers && !narrow ? "active" : ""}
              >
                <MembersIcon />
              </MemberBtn>
            )}
            <MoreBtn onClick={() => setShowChannelMenu(!showChannelMenu)}>
              <MoreIcon />
            </MoreBtn>
          </MenuWrapper>
          {!community && <Loading />}
          {showChannelMenu && (
            <ChannelMenu
              channel={activeChannel}
              messages={messages}
              switchMemberList={switchMemberList}
              setShowChannelMenu={setShowChannelMenu}
              setEditGroup={setEditGroup}
              onEditClick={onEditClick}
            />
          )}
        </ChatTopbar>
      )}
      {messenger && community ? (
        <>
          {!showChannelsList && !showMembersList && (
            <>
              {messenger && community ? (
                <ChatMessages
                  messages={messages}
                  activeChannelId={activeChannel.id}
                  channel={activeChannel}
                />
              ) : (
                <LoadingSkeleton />
              )}
              <ChatInput />
            </>
          )}

          {showChannelsList && narrow && (
            <NarrowChannels
              community={community.name}
              setShowChannels={setShowChannelsList}
              membersList={membersList}
              groupList={groupList}
              setCreateChat={setCreateChat}
            />
          )}
          {showMembersList && narrow && (
            <NarrowMembers
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
