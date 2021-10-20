import React, { useCallback } from "react";
import styled from "styled-components";

import { useNarrow } from "../../contexts/narrowProvider";
import { Icon } from "../Chat/ChatMessages";
import { UserIcon } from "../Icons/UserIcon";

interface MemberProps {
  member: string;
  isOnline: boolean;
  setShowChannels: (val: boolean) => void;
  setShowMembers?: (val: boolean) => void;
}

export function Member({
  member,
  isOnline,
  setShowChannels,
  setShowMembers,
}: MemberProps) {
  const narrow = useNarrow();

  const switchMemberList = useCallback(() => {
    setShowChannels(false);
    if (setShowMembers) setShowMembers(false);
  }, [setShowMembers]);

  return (
    <MemberData
      onClick={() =>
        narrow && setShowMembers ? switchMemberList() : setShowChannels(true)
      }
    >
      <MemberIcon
        style={{
          backgroundImage: "unset",
        }}
        className={isOnline ? "online" : "offline"}
      >
        <UserIcon memberView={true} />
      </MemberIcon>
      <MemberName>{member}</MemberName>
    </MemberData>
  );
}

export const MemberData = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

export const MemberName = styled.p`
  font-weight: 500;
  font-size: 15px;
  line-height: 22px;
  color: ${({ theme }) => theme.primary};
  opacity: 0.7;
  margin-left: 8px;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const MemberIcon = styled(Icon)`
  width: 24px;
  height: 24px;
  position: relative;
  background-size: contain;
  background-position: center;
  flex-shrink: 0;

  &.offline {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: ${({ theme }) => theme.secondary};
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }

  &.online {
    &::after {
      content: "";
      position: absolute;
      right: -1px;
      bottom: -2px;
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #4ebc60;
      border: 2px solid ${({ theme }) => theme.bodyBackgroundColor};
    }
  }
`;
