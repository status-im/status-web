import React from "react";
import styled from "styled-components";

import { Column } from "../CommunityIdentity";

import { Skeleton } from "./Skeleton";

export const CommunitySkeleton = () => {
  return (
    <Loading>
      <LogoSkeleton width="40px" height="40px" borderRadius="50%" />
      <Column>
        <Skeleton width="140px" height="16px" />
        <Skeleton width="65px" height="16px" />
      </Column>
    </Loading>
  );
};

const LogoSkeleton = styled(Skeleton)`
  border-radius: 50%;
  margin-right: 8px;
  flex-shrink: 0;
`;

const Loading = styled.div`
  display: flex;
  padding: 0 0 0 10px;
`;
