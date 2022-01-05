import React, { useMemo } from "react";
import { utils } from "status-communities/dist/cjs";
import styled from "styled-components";

import { useIdentity } from "../../contexts/identityProvider";
import { useMessengerContext } from "../../contexts/messengerProvider";
import { ChannelData } from "../../models/ChannelData";
import { textMediumStyles } from "../Text";

import { ChannelInfo, ChannelLogo, ChannelName } from "./Channel";

type EmptyChannelProps = {
  channel: ChannelData;
};

export function EmptyChannel({ channel }: EmptyChannelProps) {
  const identity = useIdentity();
  const { contacts } = useMessengerContext();
  const members = useMemo(() => {
    if (channel?.members && identity) {
      const publicKey = utils.bufToHex(identity.publicKey);
      return channel.members
        .filter((contact) => contact.id !== publicKey)
        .map((member) => contacts?.[member.id] ?? member);
    }
    return [];
  }, [channel, contacts]);
  return (
    <Wrapper>
      <ChannelInfoEmpty>
        <ChannelLogoEmpty icon={channel.icon}>
          {" "}
          {!channel.icon && channel.name.slice(0, 1).toUpperCase()}
        </ChannelLogoEmpty>
        <ChannelNameEmpty active={true} channel={channel} />
      </ChannelInfoEmpty>

      {channel.type === "dm" ? (
        <EmptyText>
          Any messages you send here are encrypted and can only be read by you
          and <br />
          <span>{channel.name.slice(0, 10)}</span>.
        </EmptyText>
      ) : channel.type === "group" ? (
        <EmptyTextGroup>
          {identity && <span>{utils.bufToHex(identity.publicKey)}</span>}{" "}
          created a group with{" "}
          {members.map((contact, idx) => (
            <span key={contact.id}>
              {contact?.customName ?? contact.trueName.slice(0, 10)}
              {idx < members.length - 1 && <> and </>}
            </span>
          ))}
        </EmptyTextGroup>
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
  margin-bottom: 32px;
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
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
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

const EmptyTextGroup = styled(EmptyText)`
  & > span {
    word-break: break-all;
  }
`;
