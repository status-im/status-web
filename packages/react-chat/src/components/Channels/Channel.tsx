import React, { useMemo } from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { GroupIcon } from "../Icons/GroupIcon";
import { MutedIcon } from "../Icons/MutedIcon";
import { textMediumStyles } from "../Text";

interface ChannelProps {
  channel: ChannelData;
  notification?: number;
  isActive: boolean;
  isMuted: boolean;
  activeView?: boolean;
  onClick?: () => void;
}

export function Channel({
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
      onClick={onClick}
    >
      <ChannelInfo>
        <ChannelLogo
          style={{
            backgroundImage: channel.icon ? `url(${channel.icon}` : "",
          }}
          className={className}
        >
          {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
        </ChannelLogo>
        <ChannelTextInfo>
          <ChannelName
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
            {channel.type && channel.type === "group" ? (
              <GroupIcon />
            ) : channel.type === "dm" ? (
              ""
            ) : (
              "#"
            )}{" "}
            {channel.name.slice(0, 10)}
          </ChannelName>
          {activeView && (
            <ChannelDescription> {channel.description}</ChannelDescription>
          )}
        </ChannelTextInfo>
      </ChannelInfo>
      {notification && notification > 0 && !activeView && (
        <NotificationBagde>{notification}</NotificationBagde>
      )}
      {isMuted && !notification && <MutedIcon />}
    </ChannelWrapper>
  );
}

const ChannelWrapper = styled.div`
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

export const ChannelLogo = styled.div`
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

export const ChannelName = styled.div`
  font-weight: 500;
  opacity: 0.7;
  color: ${({ theme }) => theme.primary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

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

const ChannelDescription = styled.p`
  font-size: 12px;
  line-height: 16px;
  letter-spacing: 0.1px;
  color: ${({ theme }) => theme.secondary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

const NotificationBagde = styled.div`
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
  flex-shrink: 0;
`;
