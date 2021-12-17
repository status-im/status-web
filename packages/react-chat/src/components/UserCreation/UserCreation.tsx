import React from "react";
import styled from "styled-components";

import {
  UserCreationState,
  useUserCreationState,
} from "../../contexts/userCreationStateProvider";
import { ColorChatIcon } from "../Icons/ColorChatIcon";

export function UserCreation() {
  const state = useUserCreationState();
  return (
    <Background>
      <Wrapper>
        <IconWrapper>
          <ColorChatIcon />
        </IconWrapper>
        <TitleWrapper>Want in on the discussion ?</TitleWrapper>
        <ThrowAwayButton onClick={() => state[1](UserCreationState.Creating)}>
          Use a throwaway account
        </ThrowAwayButton>
      </Wrapper>
    </Background>
  );
}

const ThrowAwayButton = styled.button`
  font-family: Inter;
  font-style: normal;
  font-weight: 500;
  font-size: 13px;
  line-height: 18px;
  display: flex;
  align-items: center;
  text-align: center;
  color: #4360df;
`;

const IconWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
`;

const TitleWrapper = styled.div`
  font-family: Inter;
  font-style: normal;
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-align: center;
  margin-top: 25px;
  margin-bottom: 24px;
`;

const Wrapper = styled.div`
  margin: auto;
  align-items: center;
  display: flex;
  flex-direction: column;
`;

const Background = styled.div`
  background: #f6f8fa;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
`;
