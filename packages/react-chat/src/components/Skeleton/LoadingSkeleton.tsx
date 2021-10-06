import React from "react";
import styled from "styled-components";

import useWindowDimensions from "../../hooks/useWindowDimensions";
import { Theme } from "../../styles/themes";

import { MessageSkeleton } from "./MessageSkeleton";
import { Skeleton } from "./Skeleton";

interface LoadingSkeletonProps {
  theme: Theme;
}

export const LoadingSkeleton = ({ theme }: LoadingSkeletonProps) => {
  const { height } = useWindowDimensions();
  const skeletonHeight = (height - 125) / 70;
  const skeletonBlocksAmount = Math.floor(skeletonHeight);

  return (
    <Loading>
      {height > 950 && (
        <AdditionalSkeletons>
          {[...Array(skeletonBlocksAmount)].map((_, index) => (
            <MessageSkeleton theme={theme} key={index}>
              <Skeleton theme={theme} />
            </MessageSkeleton>
          ))}
        </AdditionalSkeletons>
      )}

      <InitialSleletons>
        {" "}
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
        <MessageSkeleton theme={theme}>
          <Skeleton theme={theme} />
        </MessageSkeleton>
      </InitialSleletons>
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

const InitialSleletons = styled.div`
  display: flex;
  flex-direction: column;
`;

const AdditionalSkeletons = styled.div`
  display: flex;
  flex-direction: column;
`;
