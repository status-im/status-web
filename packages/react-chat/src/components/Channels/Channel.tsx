import React from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { GroupIcon } from "../Icons/GroupIcon";
import { MutedIcon } from "../Icons/MutedIcon";
import { textMediumStyles } from "../Text";

function RenderChannelName({
  channel,
  className,
}: {
  channel: ChannelData;
  className?: string;
}) {
  switch (channel.type) {
    case "group":
      return (
        <div className={className}>
          <GroupIcon />
          {channel.name}
        </div>
      );
    case "channel":
      return <div className={className}>{`# ${channel.name}`}</div>;
    case "dm":
      return <div className={className}>{channel.name}</div>;
  }
}

function ChannelIcon({
  channel,
  activeView,
}: {
  channel: ChannelData;
  activeView?: boolean;
}) {
  const narrow = useNarrow();
  return (
    <ChannelLogo
      icon={channel.icon}
      className={activeView ? "active" : narrow ? "narrow" : ""}
    >
      {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
    </ChannelLogo>
  );
}

interface ChannelProps {
  channel: ChannelData;
  notified?: boolean;
  mention?: number;
  isActive: boolean;
  activeView?: boolean;
  onClick?: () => void;
}

export function Channel({
  channel,
  isActive,
  activeView,
  onClick,
  notified,
  mention,
}: ChannelProps) {
  const narrow = useNarrow();

  return (
    <ChannelWrapper
      className={`${isActive && "active"}`}
      isNarrow={narrow && activeView}
      onClick={onClick}
    >
      <ChannelInfo>
        <ChannelIcon channel={channel} activeView={activeView} />
        <ChannelTextInfo>
          <ChannelName
            channel={channel}
            active={isActive || narrow}
            muted={channel?.isMuted}
            notified={notified}
          />
          {activeView && (
            <ChannelDescription>{channel.description}</ChannelDescription>
          )}
        </ChannelTextInfo>
      </ChannelInfo>
      {!activeView && !!mention && mention > 0 && !channel?.isMuted && (
        <NotificationBagde>{mention}</NotificationBagde>
      )}
      {channel?.isMuted && <MutedIcon />}
    </ChannelWrapper>
  );
}

const ChannelWrapper = styled.div<{ isNarrow?: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  width: ${({ isNarrow }) => (isNarrow ? "calc(100% - 162px)" : "100%")};
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
  white-space: nowrap;
`;

export const ChannelLogo = styled.div<{ icon?: string }>`
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
  backgroundimage: ${({ icon }) => icon && `url(${icon}`};
  color: ${({ theme }) => theme.iconTextColor};

  &.active {
    width: 36px;
    height: 36px;
    font-size: 20px;
  }

  &.narrow {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }
`;

export const ChannelName = styled(RenderChannelName)<{
  muted?: boolean;
  notified?: boolean;
  active?: boolean;
}>`
  font-weight: ${({ notified, muted, active }) =>
    notified && !muted && !active ? "600" : "500"};
  opacity: ${({ notified, muted, active }) =>
    muted ? "0.4" : notified || active ? "1.0" : "0.7"};
  color: ${({ theme }) => theme.primary};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;

  ${textMediumStyles}
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
