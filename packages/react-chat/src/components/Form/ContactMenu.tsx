import React, { useMemo } from "react";
import styled from "styled-components";

import { useBlockedUsers } from "../../contexts/blockedUsersProvider";

import { DropdownMenu, MenuItem } from "./DropdownMenu";

type ContactMenuProps = {
  id: string;
  setShowMenu: (val: boolean) => void;
};

export function ContactMenu({ id, setShowMenu }: ContactMenuProps) {
  const { blockedUsers, setBlockedUsers } = useBlockedUsers();
  const userInBlocked = useMemo(
    () => blockedUsers.includes(id),
    [blockedUsers, id]
  );
  return (
    <ContactDropdown>
      <MenuItem
        onClick={() => {
          userInBlocked
            ? setBlockedUsers((prev) => prev.filter((e) => e != id))
            : setBlockedUsers((prev) => [...prev, id]);
          setShowMenu(false);
        }}
      >
        {userInBlocked ? "Unblock user" : "Block user"}
      </MenuItem>
    </ContactDropdown>
  );
}

const ContactDropdown = styled(DropdownMenu)`
  top: 20px;
  left: 0px;
`;
