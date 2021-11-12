import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { AddMemberIconSvg } from "../Icons/AddMemberIcon";
import { CheckSvg } from "../Icons/CheckIcon";
import { EditSvg } from "../Icons/EditIcon";
import { LeftIconSvg } from "../Icons/LeftIcon";
import { MembersSmallSvg } from "../Icons/MembersSmallIcon";
import { MuteSvg } from "../Icons/MuteIcon";
import { EditModalName } from "../Modals/EditModal";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ChannelMenuProps {
  channel: ChannelData;
  switchMemberList: () => void;
  setShowChannelMenu: (val: boolean) => void;
  setEditGroup: (val: boolean) => void;
  setGroupList: any;
}

export const ChannelMenu = ({
  channel,
  switchMemberList,
  setShowChannelMenu,
  setEditGroup,
  setGroupList,
}: ChannelMenuProps) => {
  const narrow = useNarrow();
  const { clearNotifications, setActiveChannel, channels } =
    useMessengerContext();
  const { setModal } = useModal(EditModalName);
  return (
    <DropdownMenu>
      {narrow && (
        <MenuItem
          onClick={() => {
            switchMemberList();
            setShowChannelMenu(false);
          }}
        >
          <MembersSmallSvg width={16} height={16} />
          <MenuText>View Members</MenuText>
        </MenuItem>
      )}
      {channel.type === "group" && (
        <>
          <MenuItem
            onClick={() => {
              setEditGroup(true);
              setShowChannelMenu(false);
            }}
          >
            <AddMemberIconSvg width={16} height={16} />
            <MenuText>Add / remove from group</MenuText>
          </MenuItem>
<<<<<<< HEAD
          <MenuItem onClick={() => setModal(true)}>
            <EgitGroupSvg width={16} height={16} />
=======
          <MenuItem onClick={onEditClick}>
            <EditSvg width={16} height={16} />
>>>>>>> 1b1d9f9 (Add profile modal)
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
      {channel.type === "group" && (
        <MenuSection>
          {" "}
          <MenuItem
            onClick={() => {
              setGroupList((prevGroups: string[][]) => {
                const idx = prevGroups.indexOf(channel.name.split(", "));
                return idx >= 0 ? prevGroups.splice(idx, 1) : [];
              });
              setActiveChannel(channels[0]);
              setShowChannelMenu(false);
            }}
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
