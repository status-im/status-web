import React from "react";

import { CommunityData } from "../models/CommunityData";

import { CommunityIdentity } from "./CommunityIdentity";

interface CommunityProps {
  community: CommunityData;
  onClick: () => void;
  className?: string;
}

export function Community({ community, onClick, className }: CommunityProps) {
  const { name, icon, members } = community;

  return (
    <>
      <button className={className} onClick={onClick}>
        <CommunityIdentity
          name={name}
          icon={icon}
          subtitle={`${members} members`}
        />
      </button>
    </>
  );
}
