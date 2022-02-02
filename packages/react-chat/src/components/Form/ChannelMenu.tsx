import React, { useMemo, useState } from "react";
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
import { NextIcon } from "../Icons/NextIcon";
import { ProfileIcon } from "../Icons/ProfileIcon";
import { EditModalName } from "../Modals/EditModal";
import { LeavingModalName } from "../Modals/LeavingModal";
import { ProfileModalName } from "../Modals/ProfileModal";

import { DropdownMenu, MenuItem, MenuSection, MenuText } from "./DropdownMenu";
import { MuteMenu } from "./MuteMenu";

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
  const { clearNotifications, channelsDispatch } = useMessengerContext();
  const { setModal } = useModal(EditModalName);
  const { setModal: setLeavingModal } = useModal(LeavingModalName);
  const { setModal: setProfileModal } = useModal(ProfileModalName);
  const [showSubmenu, setShowSubmenu] = useState(false);

  const { showMenu, setShowMenu: setShowSideMenu } = useContextMenu(
    channel.id + "contextMenu"
  );

  const setShowMenu = useMemo(
    () => (setShowChannelMenu ? setShowChannelMenu : setShowSideMenu),
    [setShowChannelMenu, setShowSideMenu]
  );

  if (showMenu || setShowChannelMenu) {
    return (
      <ChannelDropdown className={className}>
        {narrow && !className && channel.type !== "dm" && (
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
              if (channel.isMuted) {
                channelsDispatch({ type: "ToggleMuted", payload: channel.id });
                setShowMenu(false);
              }
            }}
            onMouseEnter={() => {
              if (!channel.isMuted) setShowSubmenu(true);
            }}
            onMouseLeave={() => {
              if (!channel.isMuted) setShowSubmenu(false);
            }}
          >
            <MuteIcon width={16} height={16} />
            {!channel.isMuted && <NextIcon />}
            <MenuText>
              {(channel.isMuted ? "Unmute" : "Mute") +
                (channel.type === "group" ? " Group" : " CommunityChatRoom")}
            </MenuText>
            {!channel.isMuted && showSubmenu && (
              <MuteMenu
                setIsMuted={() =>
                  channelsDispatch({ type: "ToggleMuted", payload: channel.id })
                }
                className={className}
              />
            )}
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
              {channel.type === "group"
                ? "Leave Group"
                : "Delete CommunityChatRoom"}
            </MenuText>
          </MenuItem>
        )}
      </ChannelDropdown>
    );
  } else {
    return null;
  }
};

const ChannelDropdown = styled(DropdownMenu)`
  top: calc(100% + 4px);
  right: 0px;

  &.side {
    top: 20px;
    left: calc(100% - 35px);
    right: unset;
  }

  &.sideNarrow {
    top: 20px;
    right: 8px;
  }
`;
