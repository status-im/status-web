import React, { useEffect, useMemo } from "react";
import styled from "styled-components";

import { useNarrow } from "../contexts/narrowProvider";
import { ChannelData, channels } from "../helpers/channelsMock";
import { CommunityData } from "../helpers/communityMock";
import { Theme } from "../styles/themes";

import { Community } from "./Community";
import { MutedIcon } from "./Icons/MutedIcon";
import { textMediumStyles } from "./Text";

interface ChannelsProps {
  theme: Theme;
  community: CommunityData;
  notifications: { [id: string]: number };
  clearNotifications: (id: string) => void;

  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
}

export function Channels({
  theme,
  community,
  notifications,
  setActiveChannel,
  clearNotifications,
  activeChannelId,
}: ChannelsProps) {
  useEffect(() => {
    const channel = channels.find((channel) => channel.id === activeChannelId);
    if (channel) {
      if (notifications[channel.name] > 0) {
        clearNotifications(channel.name);
      }
    }
  }, [notifications, activeChannelId]);

  return (
    <ChannelsWrapper theme={theme}>
      <StyledCommunity theme={theme} community={community} />
      <ChannelList>
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            theme={theme}
            isActive={channel.id === activeChannelId}
            isMuted={channel.isMuted || false}
            notification={
              notifications[channel.name] > 0 && !channel.isMuted
                ? notifications[channel.name]
                : undefined
            }
            onClick={() => {
              setActiveChannel(channel);
            }}
          />
        ))}
      </ChannelList>
    </ChannelsWrapper>
  );
}

interface ChannelProps {
  theme: Theme;
  channel: ChannelData;
  notification?: number;
  isActive: boolean;
  isMuted: boolean;
  activeView?: boolean;
  onClick?: () => void;
}

export function Channel({
  theme,
  channel,
  isActive,
  isMuted,
  activeView,
  onClick,
  notification,
}: ChannelProps) {
  const narrow = useNarrow();
  const className = useMemo(
    () => (narrow && !activeView ? "narrow" : activeView ? "active" : ""),
    [narrow]
  );

  return (
    <ChannelWrapper
      className={
        (isActive && !activeView) || (isActive && narrow) ? "active" : ""
      }
      style={{ width: narrow && activeView ? "calc(100% - 162px)" : "100%" }}
      theme={theme}
      onClick={onClick}
    >
      <ChannelInfo>
        <ChannelLogo
          style={{
            backgroundImage: channel.icon ? `url(${channel.icon}` : "",
          }}
          className={className}
          theme={theme}
        >
          {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
        </ChannelLogo>
        <ChannelTextInfo>
          <ChannelName
            theme={theme}
            className={
              isActive || narrow
                ? "active"
                : notification && notification > 0
                ? "notified"
                : isMuted
                ? "muted"
                : ""
            }
          >
            # {channel.name}
          </ChannelName>
          {activeView && (
            <ChannelDescription theme={theme}>
              {" "}
              {channel.description}
            </ChannelDescription>
          )}
        </ChannelTextInfo>
      </ChannelInfo>
      {notification && notification > 0 && !activeView && (
        <NotificationBagde theme={theme}>{notification}</NotificationBagde>
      )}
      {isMuted && !notification && <MutedIcon theme={theme} />}
    </ChannelWrapper>
  );
}
interface ThemeProps {
  theme: Theme;
}

const ChannelsWrapper = styled.div<ThemeProps>`
  width: 21%;
  height: 100%;
  min-width: 196px;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 10px 0.6%;
  display: flex;
  flex-direction: column;
`;

const StyledCommunity = styled(Community)`
  padding: 0 0 0 10px;
  margin: 0 0 16px;
`;

const ChannelDescription = styled.p<ThemeProps>`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.secondary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;

  &::-webkit-scrollbar {
    width: 0;
  }
`;

const ChannelWrapper = styled.div<ThemeProps>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;

  &.active {
    background-color: ${({ theme }) => theme.activeChannelBackground};
    border-radius: 8px;
  }
`;

export const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
`;

const ChannelTextInfo = styled.div`
  display: flex;
  flex-direction: column;
  text-overflow: ellipsis;
  overflow: hidden;
`;

export const ChannelLogo = styled.div<ThemeProps>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-right: 10px;
  border-radius: 50%;
  font-weight: bold;
  font-size: 15px;
  line-height: 20px;
  background-color: ${({ theme }) => theme.iconColor};
  background-size: cover;
  background-repeat: no-repeat;
  color: ${({ theme }) => theme.iconTextColor};

  &.active {
    width: 36px;
    height: 36px;
    font-size: 20px;
    line-height: 20px;
  }

  &.narrow {
    width: 40px;
    height: 40px;
    font-size: 20px;
    line-height: 20px;
  }
`;

export const ChannelName = styled.p<ThemeProps>`
  font-weight: 500;
  opacity: 0.7;
  color: ${({ theme }) => theme.primary};
  ${textMediumStyles}

  &.active,
  &.notified {
    opacity: 1;
  }

  &.muted {
    opacity: 0.4;
  }

  &.notified {
    font-weight: 600;
  }
`;

const NotificationBagde = styled.div<ThemeProps>`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  font-size: 12px;
  line-height: 16px;
  background-color: ${({ theme }) => theme.notificationColor};
  color: ${({ theme }) => theme.bodyBackgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
`;
