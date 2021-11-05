import React from "react";

import { CommunityData } from "../models/CommunityData";

import { CommunityIdentity } from "./CommunityIdentity";

interface CommunityProps {
  community: CommunityData;
  onClick: () => void;
  className?: string;
}

export function Community({ community, onClick, className }: CommunityProps) {
  return (
    <>
      <button className={className} onClick={onClick}>
        <CommunityIdentity
          community={community}
          subtitle={`${community.members} members`}
        />
      </button>
    </>
  );
}
