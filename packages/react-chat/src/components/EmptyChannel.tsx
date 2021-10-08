import React from "react";
import styled from "styled-components";

import { ChannelData } from "../helpers/channelsMock";

import { ChannelInfo, ChannelLogo, ChannelName } from "./Channels";
import { textMediumStyles } from "./Text";

type EmptyChannelProps = {
  channel: ChannelData;
};

export function EmptyChannel({ channel }: EmptyChannelProps) {
  return (
    <Wrapper>
      <ChannelInfoEmpty>
        <ChannelLogoEmpty
          style={{
            backgroundImage: channel.icon ? `url(${channel.icon}` : "",
          }}
        >
          {" "}
          {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
        </ChannelLogoEmpty>
        <ChannelNameEmpty className={"active"}>{channel.name}</ChannelNameEmpty>
      </ChannelInfoEmpty>
      <EmptyText>
        Welcome to the beginning of the <span>#{channel.name}</span> channel!
      </EmptyText>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: calc(100% - 44px);
  padding: 8px 16px 0;
`;

const ChannelInfoEmpty = styled(ChannelInfo)`
  flex-direction: column;
`;

const ChannelLogoEmpty = styled(ChannelLogo)`
  width: 120px;
  height: 120px;
  font-weight: bold;
  font-size: 51px;
  line-height: 62px;
  margin-bottom: 16px;
`;

const ChannelNameEmpty = styled(ChannelName)`
  font-weight: bold;
  font-size: 22px;
  line-height: 30px;
  margin-bottom: 16px;
`;

const EmptyText = styled.p`
  display: inline-block;
  color: ${({ theme }) => theme.secondary};

  & > span {
    color: ${({ theme }) => theme.primary};
  }

  ${textMediumStyles}
`;
