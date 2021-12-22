import React, { useState } from "react";
import styled from "styled-components";

import { useActivities } from "../../contexts/activityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ActivityCenter } from "../ActivityCenter";
import { Channel } from "../Channels/Channel";
import { Community } from "../Community";
import { ChannelMenu } from "../Form/ChannelMenu";
import { ActivityIcon } from "../Icons/ActivityIcon";
import { MembersIcon } from "../Icons/MembersIcon";
import { MoreIcon } from "../Icons/MoreIcon";
import { CommunitySkeleton } from "../Skeleton/CommunitySkeleton";
import { Loading } from "../Skeleton/Loading";

import { ChatBodyState } from "./ChatBody";

type ChatTopbarProps = {
  showState: ChatBodyState;
  className: string;
  onClick: () => void;
  switchShowState: (state: ChatBodyState) => void;
  showMembers: boolean;
  setEditGroup: React.Dispatch<React.SetStateAction<boolean>>;
};

export function ChatTopbar({
  showState,
  className,
  onClick,
  switchShowState,
  showMembers,
  setEditGroup,
}: ChatTopbarProps) {
  const { messenger, activeChannel, communityData } = useMessengerContext();
  const { activities } = useActivities();
  const narrow = useNarrow();
  const [showChannelMenu, setShowChannelMenu] = useState(false);
  const [showActivityCenter, setShowActivityCenter] = useState(false);

  return (
    <Topbar
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
        <ActivityWrapper>
          <TopBtn onClick={() => setShowActivityCenter(!showActivityCenter)}>
            <ActivityIcon />
            {activities.length > 0 && (
              <NotificationBagde
                className={
                  activities.length > 99
                    ? "countless"
                    : activities.length > 9
                    ? "wide"
                    : undefined
                }
              >
                {activities.length < 100 ? activities.length : "∞"}
              </NotificationBagde>
            )}
          </TopBtn>
        </ActivityWrapper>
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
      {showActivityCenter && (
        <ActivityCenter setShowActivityCenter={setShowActivityCenter} />
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
  max-width: 85%;

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

const ActivityWrapper = styled.div`
  padding-left: 10px;
  margin-left: 10px;
  position: relative;

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 50%;
    width: 2px;
    height: 24px;
    transform: translateY(-50%);
    border-radius: 1px;
    background: ${({ theme }) => theme.primary};
    opacity: 0.1;
  }
`;

export const TopBtn = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  padding: 0;

  &:hover {
    background: ${({ theme }) => theme.inputColor};
  }

  &:active {
    background: ${({ theme }) => theme.sectionBackgroundColor};
  }
`;

const NotificationBagde = styled.div`
  width: 18px;
  height: 18px;
  position: absolute;
  top: -2px;
  right: -2px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: 50%;
  font-size: 12px;
  line-height: 16px;
  font-weight: 500;
  background-color: ${({ theme }) => theme.notificationColor};
  color: ${({ theme }) => theme.bodyBackgroundColor};
  border-radius: 9px;

  &.wide {
    width: 26px;
    right: -7px;
  }

  &.countless {
    width: 22px;
  }
`;
