import React from "react";
import styled from "styled-components";

import { Theme } from "../../styles/themes";

import { MessageSkeleton } from "./MessageSkeleton";
import { Skeleton } from "./Skeleton";

interface LoadingSkeletonProps {
  theme: Theme;
}

export const LoadingSkeleton = ({ theme }: LoadingSkeletonProps) => {
  return (
    <Loading>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} />
        <Skeleton theme={theme} width="30%" />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} width="70%" />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} width="40%" />
        <Skeleton theme={theme} width="25%" />
        <Skeleton theme={theme} width="30%" />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} width="50%" />
        <Skeleton
          theme={theme}
          width="147px"
          height="196px"
          borderRadius="16px"
        />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} width="50%" />
      </MessageSkeleton>
      <MessageSkeleton theme={theme}>
        <Skeleton theme={theme} width="70%" />
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
