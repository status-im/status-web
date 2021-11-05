import React from "react";
import styled from "styled-components";

import { useMessengerContext } from "../contexts/messengerProvider";

import { CommunityIdentity } from "./CommunityIdentity";
import { CommunitySkeleton } from "./Skeleton/CommunitySkeleton";

interface CommunityProps {
  onClick: () => void;
  className?: string;
}

export function Community({ onClick, className }: CommunityProps) {
  const { communityData } = useMessengerContext();

  if (!communityData) {
    return (
      <SkeletonWrapper>
        <CommunitySkeleton />
      </SkeletonWrapper>
    );
  }

  return (
    <>
      <button className={className} onClick={onClick}>
        <CommunityIdentity subtitle={`${communityData.members} members`} />
      </button>
    </>
  );
}

const SkeletonWrapper = styled.div`
  margin-bottom: 16px;
`;
