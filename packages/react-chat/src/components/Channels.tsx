import React, { useEffect } from "react";
import styled from "styled-components";

import { ChannelData, channels } from "../helpers/channelsMock";
import { Theme } from "../styles/themes";

import { MutedIcon } from "./Icons/MutedIcon";

interface ChannelsProps {
  theme: Theme;
  icon: string;
  name: string;
  notifications: { [id: string]: number };
  clearNotifications: (id: string) => void;
  members: number;
  setActiveChannel: (val: ChannelData) => void;
  activeChannelId: number;
}

export function Channels({
  theme,
  icon,
  name,
  members,
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
      <Community>
        <CommunityLogo src={icon} alt={`${name} logo`} />
        <CommunityInfo>
          <CommunityName theme={theme}>{name}</CommunityName>
          <MembersAmount theme={theme}>{members} members</MembersAmount>
        </CommunityInfo>
      </Community>
      <ChannelList>
        {channels.map((channel) => (
          <Channel
            key={channel.id}
            channel={channel}
            theme={theme}
            isActive={channel.id === activeChannelId}
            isMuted={channel.isMuted || false}
            notification={
              notifications[channel.name] > 0
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
  return (
    <ChannelWrapper
      className={isActive && !activeView ? "active" : ""}
      theme={theme}
      onClick={onClick}
    >
      <ChannelInfo>
        <ChannelLogo
          style={{
            backgroundImage: channel.icon ? `url(${channel.icon}` : "",
          }}
          className={activeView ? "active" : ""}
          theme={theme}
        >
          {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
        </ChannelLogo>
        <ChannelTextInfo>
          <ChannelName
            theme={theme}
            className={
              isActive
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
            <MembersAmount theme={theme}>
              {" "}
              {channel.members} members
            </MembersAmount>
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
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
  padding: 10px 0.6%;
  display: flex;
  flex-direction: column;
`;

const Community = styled.div`
  display: flex;
  margin-bottom: 16px;
`;

const CommunityLogo = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  margin-left: 10px;
`;

const CommunityInfo = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;
`;

const CommunityName = styled.h1<ThemeProps>`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.textPrimaryColor};
`;

const MembersAmount = styled.p<ThemeProps>`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.textSecondaryColor};
`;

const ChannelList = styled.div`
  display: flex;
  flex-direction: column;
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

const ChannelInfo = styled.div`
  display: flex;
  align-items: center;
`;

const ChannelTextInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const ChannelLogo = styled.div<ThemeProps>`
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
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
`;

const ChannelName = styled.p<ThemeProps>`
  color: ${({ theme }) => theme.textPrimaryColor};
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  opacity: 0.7;

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
