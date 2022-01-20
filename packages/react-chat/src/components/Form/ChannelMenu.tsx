import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { ChannelData } from "../../models/ChannelData";
import { AddMemberIconSvg } from "../Icons/AddMemberIcon";
import { CheckSvg } from "../Icons/CheckIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { EditSvg } from "../Icons/EditIcon";
import { LeftIconSvg } from "../Icons/LeftIcon";
import { MembersSmallSvg } from "../Icons/MembersSmallIcon";
import { MuteSvg } from "../Icons/MuteIcon";
import { EditModalName } from "../Modals/EditModal";
import { LeavingModalName } from "../Modals/LeavingModal";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ChannelMenuProps {
  channel: ChannelData;
  switchMemberList: () => void;
  setShowChannelMenu: (val: boolean) => void;
  setEditGroup: (val: boolean) => void;
}

export const ChannelMenu = ({
  channel,
  switchMemberList,
  setShowChannelMenu,
  setEditGroup,
}: ChannelMenuProps) => {
  const narrow = useNarrow();
  const { clearNotifications } = useMessengerContext();
  const { setModal } = useModal(EditModalName);
  const { setModal: setLeavingModal } = useModal(LeavingModalName);

  return (
    <DropdownMenu closeMenu={setShowChannelMenu}>
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
          <MenuItem onClick={() => setModal(true)}>
            <EditSvg width={16} height={16} />
            <MenuText>Edit name and image</MenuText>
          </MenuItem>
        </>
      )}
      <MenuItem
        onClick={() => {
          channel.isMuted = !channel.isMuted;
          setShowChannelMenu(false);
        }}
      >
        <MuteSvg width={16} height={16} />
        <MenuText>
          {(channel.isMuted ? "Unmute" : "Mute") +
            (channel.type === "group" ? " Group" : " Chat")}
        </MenuText>
      </MenuItem>
      <MenuItem onClick={() => clearNotifications(channel.id)}>
        <CheckSvg width={16} height={16} />
        <MenuText>Mark as Read</MenuText>
      </MenuItem>
      {(channel.type === "group" || channel.type === "dm") && (
        <MenuSection>
          {" "}
          <MenuItem
            onClick={() => {
              setLeavingModal(true);
              setShowChannelMenu(false);
            }}
          >
            {channel.type === "group" && (
              <LeftIconSvg width={16} height={16} className="red" />
            )}
            {channel.type === "dm" && (
              <DeleteIcon width={16} height={16} className="red" />
            )}
            <MenuText className="red">
              {channel.type === "group" ? "Leave Group" : "Delete Chat"}
            </MenuText>
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
