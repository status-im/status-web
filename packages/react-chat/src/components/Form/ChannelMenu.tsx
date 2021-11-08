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

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ChannelMenuProps {
  channel: ChannelData;
  messages: ChatMessage[];
  switchMemberList: () => void;
  setShowChannelMenu: (val: boolean) => void;
  setEditGroup: (val: boolean) => void;
  onEditClick: () => void;
  setGroupList: any;
}

export const ChannelMenu = ({
  channel,
  messages,
  switchMemberList,
  setShowChannelMenu,
  setEditGroup,
  onEditClick,
  setGroupList,
}: ChannelMenuProps) => {
  const narrow = useNarrow();
  const { clearNotifications } = useMessengerContext();

  return (
    <DropdownMenu>
      {narrow && (
        <MenuItem
          onClick={() => {
            switchMemberList();
            setShowChannelMenu(false);
          }}
        >
          <MembersSmallSvg height={16} width={16} />
          <MenuText>View Members</MenuText>
        </MenuItem>
      )}
      {channel.type === "group" && (
        <>
          <MenuItem onClick={() => setEditGroup(true)}>
            <AddMemberIconSvg width={16} height={16} />
            <MenuText>Add / remove from group</MenuText>
          </MenuItem>
          <MenuItem onClick={onEditClick}>
            <EgitGroupSvg width={16} height={16} />
            <MenuText>Edit name and image</MenuText>
          </MenuItem>
        </>
      )}
      <MenuItem
        onClick={() => {
          channel.isMuted = true;
          setShowChannelMenu(false);
        }}
      >
        <MuteSvg width={16} height={16} />
        <MenuText>Mute Chat</MenuText>
      </MenuItem>
      <MenuItem onClick={() => clearNotifications(channel.id)}>
        <CheckSvg width={16} height={16} />
        <MenuText>Mark as Read</MenuText>
      </MenuItem>
      <MenuItem onClick={() => messages.length === 0}>
        <ClearSvg width={16} height={16} />
        <MenuText>Clear History</MenuText>
      </MenuItem>
      {channel.type === "group" && (
        <MenuSection>
          {" "}
          <MenuItem
            onClick={() =>
              setGroupList((prevGroups: string[][]) => {
                const idx = prevGroups.indexOf(channel.name.split(", "));
                return prevGroups.splice(idx, 1);
              })
            }
          >
            <LeftIconSvg width={16} height={16} />
            <MenuText>Leave Group</MenuText>
          </MenuItem>
        </MenuSection>
      )}
    </DropdownMenu>
  );
};

const MenuSection = styled.div`
  margin-top: 5px;
  padding-top: 5px;
  border-top: 1px solid ${({ theme }) => theme.inputColor};
`;
