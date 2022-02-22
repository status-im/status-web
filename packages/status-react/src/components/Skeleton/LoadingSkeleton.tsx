import React from "react";
import styled from "styled-components";

import { MessageSkeleton } from "./MessageSkeleton";
import { Skeleton } from "./Skeleton";

export const LoadingSkeleton = () => {
  return (
    <Loading>
      <MessageSkeleton>
        <Skeleton />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton />
        <Skeleton width="30%" />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton width="70%" />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton width="40%" />
        <Skeleton width="25%" />
        <Skeleton width="30%" />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton width="50%" />
        <Skeleton width="147px" height="196px" borderRadius="16px" />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton width="50%" />
      </MessageSkeleton>
      <MessageSkeleton>
        <Skeleton width="70%" />
      </MessageSkeleton>
    </Loading>
  );
};

const Loading = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: calc(100% - 44px);
  padding: 8px 16px 0;
  overflow: auto;
`;
