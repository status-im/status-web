import React, { useMemo } from "react";
import styled from "styled-components";

import { useMessengerContext } from "../../contexts/messengerProvider";
import { useModal } from "../../contexts/modalProvider";
import { useNarrow } from "../../contexts/narrowProvider";
import { useContextMenu } from "../../hooks/useContextMenu";
import { ChannelData } from "../../models/ChannelData";
import { AddMemberIcon } from "../Icons/AddMemberIcon";
import { CheckIcon } from "../Icons/CheckIcon";
import { DeleteIcon } from "../Icons/DeleteIcon";
import { DownloadIcon } from "../Icons/DownloadIcon";
import { EditIcon } from "../Icons/EditIcon";
import { LeftIcon } from "../Icons/LeftIcon";
import { MembersSmallIcon } from "../Icons/MembersSmallIcon";
import { MuteIcon } from "../Icons/MuteIcon";
import { ProfileIcon } from "../Icons/ProfileIcon";
import { EditModalName } from "../Modals/EditModal";
import { LeavingModalName } from "../Modals/LeavingModal";
import { ProfileModalName } from "../Modals/ProfileModal";

import { DropdownMenu, MenuItem, MenuText } from "./DropdownMenu";

interface ChannelMenuProps {
  channel: ChannelData;
  setShowChannelMenu?: (val: boolean) => void;
  showNarrowMembers?: boolean;
  switchMemberList?: () => void;
  setEditGroup?: (val: boolean) => void;
  className?: string;
}

export const ChannelMenu = ({
  channel,
  setShowChannelMenu,
  showNarrowMembers,
  switchMemberList,
  setEditGroup,
  className,
}: ChannelMenuProps) => {
  const narrow = useNarrow();
  const { clearNotifications } = useMessengerContext();
  const { setModal } = useModal(EditModalName);
  const { setModal: setLeavingModal } = useModal(LeavingModalName);
  const { setModal: setProfileModal } = useModal(ProfileModalName);

  const { showMenu, setShowMenu: setShowSideMenu } = useContextMenu(
    channel.id + "contextMenu"
  );

  const setShowMenu = useMemo(
    () => (setShowChannelMenu ? setShowChannelMenu : setShowSideMenu),
    [setShowChannelMenu, setShowSideMenu]
  );

  if (showMenu || setShowChannelMenu) {
    return (
      <DropdownMenu closeMenu={setShowMenu} className={className}>
        {narrow && !className && (
          <MenuItem
            onClick={() => {
              if (switchMemberList) switchMemberList();
              setShowMenu(false);
            }}
          >
            <MembersSmallIcon width={16} height={16} />
            <MenuText>{showNarrowMembers ? "Hide" : "View"} Members</MenuText>
          </MenuItem>
        )}
        {channel.type === "group" && (
          <>
            <MenuItem
              onClick={() => {
                if (setEditGroup) setEditGroup(true);
                setShowMenu(false);
              }}
            >
              <AddMemberIcon width={16} height={16} />
              <MenuText>Add / remove from group</MenuText>
            </MenuItem>
            <MenuItem onClick={() => setModal(true)}>
              <EditIcon width={16} height={16} />
              <MenuText>Edit name and image</MenuText>
            </MenuItem>
          </>
        )}
        {channel.type === "dm" && (
          <MenuItem
            onClick={() => {
              setProfileModal({
                id: channel.name,
                renamingState: false,
                requestState: false,
              });
              setShowMenu(false);
            }}
          >
            <ProfileIcon width={16} height={16} />
            <MenuText>View Profile</MenuText>
          </MenuItem>
        )}
        <MenuSection className={`${channel.type === "channel" && "channel"}`}>
          <MenuItem
            onClick={() => {
              channel.isMuted = !channel.isMuted;
              setShowMenu(false);
            }}
          >
            <MuteIcon width={16} height={16} />
            <MenuText>
              {(channel.isMuted ? "Unmute" : "Mute") +
                (channel.type === "group" ? " Group" : " Chat")}
            </MenuText>
          </MenuItem>
          <MenuItem onClick={() => clearNotifications(channel.id)}>
            <CheckIcon width={16} height={16} />
            <MenuText>Mark as Read</MenuText>
          </MenuItem>
          <MenuItem>
            <DownloadIcon width={16} height={16} />
            <MenuText>Fetch Messages</MenuText>
          </MenuItem>
        </MenuSection>
        {(channel.type === "group" || channel.type === "dm") && (
          <MenuItem
            onClick={() => {
              setLeavingModal(true);
              setShowMenu(false);
            }}
          >
            {channel.type === "group" && (
              <LeftIcon width={16} height={16} className="red" />
            )}
            {channel.type === "dm" && (
              <DeleteIcon width={16} height={16} className="red" />
            )}
            <MenuText className="red">
              {channel.type === "group" ? "Leave Group" : "Delete Chat"}
            </MenuText>
          </MenuItem>
        )}
      </DropdownMenu>
    );
  } else {
    return null;
  }
};

const MenuSection = styled.div`
  padding: 4px 0;
  margin: 4px 0;
  border-top: 1px solid ${({ theme }) => theme.inputColor};
  border-bottom: 1px solid ${({ theme }) => theme.inputColor};

  &.channel {
    padding: 0;
    margin: 0;
    border: none;
  }
`;
