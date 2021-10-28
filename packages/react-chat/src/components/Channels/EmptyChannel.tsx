import React from "react";
import styled from "styled-components";

import { ChannelData } from "../../models/ChannelData";
import { textMediumStyles } from "../Text";

import { ChannelInfo, ChannelLogo, ChannelName } from "./Channel";

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

      {channel.type === "dm" ? (
        <EmptyText>
          Any messages you send here are encrypted and can only be read by you
          and <span>{channel.name}</span>.
        </EmptyText>
      ) : channel.type === "group" ? (
        <EmptyText>
          You created a group with <span>{channel.name.slice(1, -1)}</span> and{" "}
          <span>{channel.name.at(-1)}</span>
        </EmptyText>
      ) : (
        <EmptyText>
          Welcome to the beginning of the <span>#{channel.name}</span> channel!
        </EmptyText>
      )}
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
  max-width: 310px;
  text-align: center;

  & > span {
    color: ${({ theme }) => theme.primary};
  }

  ${textMediumStyles}
`;
