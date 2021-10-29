import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { CheckIcon } from "../Icons/CheckIcon";
import { ClearIcon } from "../Icons/ClearIcon";
import { MuteIcon } from "../Icons/MuteIcon";
import { ViewMembersIcon } from "../Icons/ViewMembersIcon";
import { textSmallStyles } from "../Text";

interface ChannelMenuProps {
  channel: ChannelData;

  messages: ChatMessage[];
  switchMemberList: () => void;
  setShowChannelMenu: (val: boolean) => void;
}

export const ChannelMenu = ({
  channel,

  messages,
  switchMemberList,
  setShowChannelMenu,
}: ChannelMenuProps) => {
  const narrow = useNarrow();
  const { clearNotifications } = useMessengerContext();

  return (
    <MenuBlock>
      <MenuList>
        {narrow && (
          <MenuItem
            onClick={() => {
              switchMemberList();
              setShowChannelMenu(false);
            }}
          >
            <ViewMembersIcon />
            <MenuText>View members</MenuText>
          </MenuItem>
        )}
        <MenuItem onClick={() => channel.isMuted === true}>
          <MuteIcon />
          <MenuText>Mute Chat</MenuText>
        </MenuItem>
        <MenuItem onClick={() => clearNotifications(channel.id)}>
          <CheckIcon />
          <MenuText>Mark as Read</MenuText>
        </MenuItem>
        <MenuItem onClick={() => messages.length === 0}>
          <ClearIcon />
          <MenuText>Clear History</MenuText>
        </MenuItem>
      </MenuList>
    </MenuBlock>
  );
};

const MenuBlock = styled.div`
  width: 207px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  borderradius: 8px;
  padding: 8px 0;
  position: absolute;
  right: 8px;
  top: calc(100% - 8px);
  z-index: 2;
`;

const MenuList = styled.ul`
  list-style: none;
`;

const MenuItem = styled.li`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 8px 14px;
  cursor: pointer;
  color: ${({ theme }) => theme.primary};

  &:hover {
    background: ${({ theme }) => theme.tertiary};
    color: ${({ theme }) => theme.bodyBackgroundColor};
  }

  & > svg {
    fill: ${({ theme }) => theme.tertiary};
  }

  &:hover > svg {
    fill: ${({ theme }) => theme.bodyBackgroundColor};
  }
`;

const MenuText = styled.span`
  margin-left: 6px;

  ${textSmallStyles}
`;
