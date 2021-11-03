import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { ChatMessage } from "../../models/ChatMessage";
import { AddMemberIconSvg } from "../Icons/AddMemberIcon";
import { CheckSvg } from "../Icons/CheckIcon";
import { ClearSvg } from "../Icons/ClearIcon";
import { EgitGroupSvg } from "../Icons/EditGroupIcon";
import { LeftIconSvg } from "../Icons/LeftIcon";
import { MembersSmallSvg } from "../Icons/MembersSmallIcon";
import { MuteSvg } from "../Icons/MuteIcon";
import { textSmallStyles } from "../Text";

type MenuItemProps = {
  Svg: ({ width, height }: { width: number; height: number }) => JSX.Element;
  text: string;
  onClick: () => void;
};

function MenuItem({ Svg, text, onClick }: MenuItemProps) {
  return (
    <Item onClick={onClick}>
      <Svg width={16} height={16} />
      <MenuText>{text}</MenuText>
    </Item>
  );
}

interface ChannelMenuProps {
  channel: ChannelData;
  messages: ChatMessage[];
  switchMemberList: () => void;
  setShowChannelMenu: (val: boolean) => void;
  setEditGroup: (val: boolean) => void;
  onEditClick: () => void;
}

export const ChannelMenu = ({
  channel,

  messages,
  switchMemberList,
  setShowChannelMenu,
  setEditGroup,
  onEditClick,
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
            Svg={MembersSmallSvg}
            text="View Members"
          />
        )}
        {channel.type === "group" && (
          <>
            <MenuItem
              onClick={() => setEditGroup(true)}
              Svg={AddMemberIconSvg}
              text="Add / remove from group"
            />
            <MenuItem
              onClick={onEditClick}
              Svg={EgitGroupSvg}
              text="Edit name and image"
            />
          </>
        )}
        <MenuItem
          onClick={() => channel.isMuted === true}
          Svg={MuteSvg}
          text="Mute Chat"
        />
        <MenuItem
          onClick={() => clearNotifications(channel.id)}
          Svg={CheckSvg}
          text="Mark as Read"
        />
        <MenuItem
          onClick={() => messages.length === 0}
          Svg={ClearSvg}
          text="Clear History"
        />
        {channel.type === "group" && (
          <MenuSection>
            {" "}
            <MenuItem
              onClick={() => channel}
              Svg={LeftIconSvg}
              text="Leave Group"
            />
          </MenuSection>
        )}
      </MenuList>
    </MenuBlock>
  );
};

const MenuBlock = styled.div`
  width: 207px;
  background: ${({ theme }) => theme.bodyBackgroundColor};
  box-shadow: 0px 2px 4px rgba(0, 34, 51, 0.16),
    0px 4px 12px rgba(0, 34, 51, 0.08);
  border-radius: 8px;
  padding: 8px 0;
  position: absolute;
  right: 8px;
  top: calc(100% - 8px);
  z-index: 2;
`;

const MenuList = styled.ul`
  list-style: none;
`;

const Item = styled.li`
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

const MenuSection = styled.div`
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid ${({ theme }) => theme.inputColor};
`;
