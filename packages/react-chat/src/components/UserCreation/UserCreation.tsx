import React from "react";
import styled from "styled-components";

import { useModal } from "../../contexts/modalProvider";
import { buttonStyles, buttonTransparentStyles } from "../Buttons/buttonStyle";
import { TokenRequirement } from "../Form/TokenRequirement";
import { ColorChatIcon } from "../Icons/ColorChatIcon";
import { StatusModalName } from "../Modals/StatusModal";
import { UserCreationModalName } from "../Modals/UserCreationModal";
import { WalletModalName } from "../Modals/WalletModal";
import { textSmallStyles } from "../Text";

interface UserCreationProps {
  permission: boolean;
}

export function UserCreation({ permission }: UserCreationProps) {
  const { setModal } = useModal(UserCreationModalName);
  const { setModal: setStatusModal } = useModal(StatusModalName);
  const { setModal: setWalletModal } = useModal(WalletModalName);

  return (
    <Wrapper>
      <ColorChatIcon />
      {permission ? (
        <TitleWrapper>Want to jump into the discussion?</TitleWrapper>
      ) : (
        <TokenRequirement />
      )}
      <LoginBtn onClick={() => setStatusModal(true)}>
        Sync with Status profile
      </LoginBtn>
      <LoginBtn onClick={() => setWalletModal(true)}>
        Connect Ethereum Wallet
      </LoginBtn>
      {permission && (
      <ThrowAwayButton onClick={() => setModal(true)}>
        Use a throwaway account
      </ThrowAwayButton>
       )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  background-color: ${({ theme }) => theme.sectionBackgroundColor};
`;

const TitleWrapper = styled.div`
  font-weight: bold;
  font-size: 17px;
  line-height: 24px;
  text-align: center;
  margin: 24px 0;
  color: ${({ theme }) => theme.primary};
`;

const LoginBtn = styled.button`
  ${buttonStyles}
  ${textSmallStyles}
  padding: 10px 12px;
  margin-bottom: 16px;
`;

const ThrowAwayButton = styled.button`
  ${buttonTransparentStyles}
`;
