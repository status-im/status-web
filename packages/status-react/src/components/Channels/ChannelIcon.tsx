import React from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";

interface ChannelIconProps {
  channel: ChannelData;
  activeView?: boolean;
}

export function ChannelIcon({ channel, activeView }: ChannelIconProps) {
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
  background-image: ${({ icon }) => icon && `url(${icon}`};
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
