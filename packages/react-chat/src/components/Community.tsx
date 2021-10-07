import React from "react";

import { CommunityData } from "../helpers/communityMock";
import { Theme } from "../styles/themes";

import { CommunityIdentity } from "./CommunityIdentity";

interface CommunityProps {
  theme: Theme;
  community: CommunityData;
  onClick: () => void;
  className?: string;
}

export function Community({
  theme,
  community,
  onClick,
  className,
}: CommunityProps) {
  const { name, icon, members } = community;

  return (
    <>
      <button className={className} onClick={onClick}>
        <CommunityIdentity
          name={name}
          icon={icon}
          subtitle={`${members} members`}
          theme={theme}
        />
      </button>
    </>
  );
}
