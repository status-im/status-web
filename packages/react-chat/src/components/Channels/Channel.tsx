import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { ChannelMenu } from "../Form/ChannelMenu";
import { Tooltip } from "../Form/Tooltip";
import { GroupIcon } from "../Icons/GroupIcon";
import { MutedIcon } from "../Icons/MutedIcon";
import { textMediumStyles } from "../Text";

import { ChannelIcon } from "./ChannelIcon";

function RenderChannelName({
  channel,
  activeView,
  className,
}: {
  channel: ChannelData;
  activeView?: boolean;
  className?: string;
}) {
  const { activeChannel } = useMessengerContext();
  switch (channel.type) {
    case "group":
      return (
        <div className={className}>
          {!activeView && (
            <GroupIcon active={channel.id === activeChannel?.id} />
          )}
          {` ${channel.name}`}
        </div>
      );
    case "channel":
      return <div className={className}>{`# ${channel.name}`}</div>;
    case "dm":
      return <div className={className}>{channel.name}</div>;
  }
}

interface ChannelProps {
  channel: ChannelData;
  notified?: boolean;
  mention?: number;
  isActive: boolean;
  activeView?: boolean;
  onClick?: () => void;
  setEditGroup?: React.Dispatch<React.SetStateAction<boolean>>;
}

export function Channel({
  channel,
  isActive,
  activeView,
  onClick,
  notified,
  mention,
  setEditGroup,
}: ChannelProps) {
  const narrow = useNarrow();

  return (
    <ChannelWrapper
      className={`${isActive && "active"}`}
      isNarrow={narrow && activeView}
      onClick={onClick}
      id={!activeView ? `${channel.id + "contextMenu"}` : ""}
    >
      <ChannelInfo className={`${narrow && "narrow"}`}>
        <ChannelIcon channel={channel} activeView={activeView} />
        <ChannelTextInfo className={`${narrow && "narrow"}`}>
          <ChannelNameWrapper>
            <ChannelName
              channel={channel}
              active={isActive || activeView || narrow}
              activeView={activeView}
              muted={channel?.isMuted}
              notified={notified}
            />
            {channel?.isMuted && activeView && !narrow && (
              <MutedBtn onClick={() => (channel.isMuted = !channel.isMuted)}>
                <MutedIcon />
                <Tooltip tip="Unmute" className="muted" />
              </MutedBtn>
            )}
          </ChannelNameWrapper>
          {activeView && (
            <ChannelDescription>{channel.description}</ChannelDescription>
          )}
        </ChannelTextInfo>
      </ChannelInfo>
      {!activeView && !!mention && mention > 0 && !channel?.isMuted && (
        <NotificationBagde>{mention}</NotificationBagde>
      )}
      {channel?.isMuted && !activeView && <MutedIcon />}
      {!activeView && (
        <ChannelMenu
          channel={channel}
          setEditGroup={setEditGroup}
          className={narrow ? "narrow" : "side"}
        />
      )}
    </ChannelWrapper>
  );
}

const ChannelWrapper = styled.div<{ isNarrow?: boolean }>`
  width: ${({ isNarrow }) => (isNarrow ? "calc(100% - 162px)" : "100%")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
  border-radius: 8px;
  position: relative;
  cursor: pointer;

  &.active,
  &:active {
    background-color: ${({ theme }) => theme.activeChannelBackground};
  }

  &:hover {
    background-color: ${({ theme }) => theme.border};
  }
`;

export const ChannelInfo = styled.div`
  display: flex;
  align-items: center;

  &.narrow {
    overflow: hidden;
  }
`;

const ChannelTextInfo = styled.div`
  display: flex;
  flex-direction: column;

  &.narrow {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

const ChannelNameWrapper = styled.div`
  display: flex;
  align-items: center;
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
  margin-right: ${({ muted }) => (muted ? "8px" : "")};
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
  font-weight: 500;
  background-color: ${({ theme }) => theme.notificationColor};
  color: ${({ theme }) => theme.bodyBackgroundColor};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const MutedBtn = styled.button`
  padding: 0;
  border: none;
  outline: none;
  position: relative;

  &:hover > svg {
    fill-opacity: 1;
  }

  &:hover > div {
    visibility: visible;
  }
`;
