import React, { useState } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import {
  ActivityButton,
  ActivityWrapper,
} from "../ActivityCenter/ActivityButton";
import { Channel } from "../Channels/Channel";
import { Community } from "../Community";
import { ChannelMenu } from "../Form/ChannelMenu";
import { ActivityIcon } from "../Icons/ActivityIcon";
import { MembersIcon } from "../Icons/MembersIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { CommunitySkeleton } from "../Skeleton/CommunitySkeleton";
import { Loading } from "../Skeleton/Loading";

import { ChatBodyState } from "./ChatBody";

export function ChatTopbarLoading() {
  const narrow = useNarrow();

  return (
    <Topbar className={narrow ? "narrow" : ""}>
      <ChannelWrapper className={narrow ? "narrow" : ""}>
        <SkeletonWrapper>
          <CommunitySkeleton />
        </SkeletonWrapper>
      </ChannelWrapper>
      <MenuWrapper>
        {!narrow && (
          <TopBtn>
            <MembersIcon />
          </TopBtn>
        )}
        <TopBtn>
          <MoreIcon />
        </TopBtn>
        <ActivityWrapper>
          <TopBtn disabled>
            <ActivityIcon />
          </TopBtn>
        </ActivityWrapper>
      </MenuWrapper>
      <Loading />
    </Topbar>
  );
}

type ChatTopbarProps = {
  showState: ChatBodyState;
  onClick: () => void;
  switchShowState: (state: ChatBodyState) => void;
  showMembers: boolean;
  setEditGroup: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ChatTopbar({
  showState,
  onClick,
  switchShowState,
  showMembers,
  setEditGroup,
}: ChatTopbarProps) {
  const { messenger, activeChannel, communityData } = useMessengerContext();

  const narrow = useNarrow();
  const [showChannelMenu, setShowChannelMenu] = useState(false);

  if (!activeChannel) {
    return <ChatTopbarLoading />;
  }

  return (
    <Topbar
      className={narrow && showState !== ChatBodyState.Chat ? "narrow" : ""}
    >
      <ChannelWrapper className={narrow ? "narrow" : ""}>
        {messenger && communityData ? (
          <>
            {narrow && (
              <CommunityWrap className={narrow ? "narrow" : ""}>
                <Community />
              </CommunityWrap>
            )}

            <Channel
              channel={activeChannel}
              isActive={narrow ? showState === ChatBodyState.Channels : false}
              activeView={true}
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
          <TopBtn onClick={onClick} className={showMembers ? "active" : ""}>
            <MembersIcon />
          </TopBtn>
        )}
        <TopBtn onClick={() => setShowChannelMenu(!showChannelMenu)}>
          <MoreIcon />
        </TopBtn>
        {!narrow && <ActivityButton />}
      </MenuWrapper>
      {!messenger && !communityData && <Loading />}
      {showChannelMenu && (
        <ChannelMenu
          channel={activeChannel}
          showNarrowMembers={showState === ChatBodyState.Members}
          switchMemberList={() => switchShowState(ChatBodyState.Members)}
          setShowChannelMenu={setShowChannelMenu}
          setEditGroup={setEditGroup}
        />
      )}
    </Topbar>
  );
}

const Topbar = styled.div`
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

const ChannelWrapper = styled.div`
  display: flex;
  align-items: center;
  max-width: 80%;

  &.narrow {
    width: calc(100% - 46px);
  }
`;

const SkeletonWrapper = styled.div`
  padding: 8px;
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

export const TopBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;
  background: ${({ theme }) => theme.bodyBackgroundColor};

  &:hover {
    background: ${({ theme }) => theme.inputColor};
  }

  &:active {
    background: ${({ theme }) => theme.sectionBackgroundColor};
  }

  &:disabled {
    cursor: default;
  }
`;
