import React from "react";

import { MembersList } from "../Members/MembersList";

import { ListWrapper, NarrowTopbar } from "./NarrowTopbar";

interface NarrowMembersProps {
  switchShowMembersList: () => void;
}

export function NarrowMembers({ switchShowMembersList }: NarrowMembersProps) {
  return (
    <ListWrapper>
      <NarrowTopbar
        list="Community members"
        onBtnClick={switchShowMembersList}
      />
      <MembersList switchShowMembers={switchShowMembersList} />
    </ListWrapper>
  );
}
